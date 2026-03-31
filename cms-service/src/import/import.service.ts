import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource, DeepPartial } from 'typeorm';
import { ImportStrategy, NormalizedProgram } from './strategies/import-strategy.interface';
import { ApplePodcastsStrategy } from './strategies/apple-podcasts.strategy';
import { ProgramsService } from '../programs/programs.service';
import { EpisodesService } from '../episodes/episodes.service';
import { MediaService } from '../media/media.service';
import { CategoriesService } from '../categories/categories.service';
import { OutboxService } from '../outbox/outbox.service';
import { EventType } from '../common/enums/event-type.enum';
import { ContentStatus } from '../common/enums/content-status.enum';
import { Program } from '../programs/entities/program.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { MediaType } from '../common/enums/media-type.enum';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  private readonly strategies: Map<string, ImportStrategy>;

  constructor(
    private readonly applePodcastsStrategy: ApplePodcastsStrategy,
    private readonly programsService: ProgramsService,
    private readonly episodesService: EpisodesService,
    private readonly mediaService: MediaService,
    private readonly categoriesService: CategoriesService,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
  ) {
    this.strategies = new Map<string, ImportStrategy>([
      ['apple_podcasts', this.applePodcastsStrategy],
    ]);
  }

  async import(
    source: string,
    config: Record<string, any>,
    status?: ContentStatus,
    categoryIds?: string[],
  ): Promise<{ program: Program; episodesImported: number }> {
    const strategy = this.strategies.get(source);

    if (!strategy) {
      throw new BadRequestException(
        `Unknown import source: "${source}". Available: ${[...this.strategies.keys()].join(', ')}`,
      );
    }

    this.logger.log(`Starting import from source: ${source}`);

    const normalizedData = await strategy.fetch(config);

    return this.persistImport(normalizedData, status ?? ContentStatus.DRAFT, categoryIds);
  }

  private async persistImport(
    data: NormalizedProgram,
    status: ContentStatus,
    categoryIds?: string[],
  ): Promise<{ program: Program; episodesImported: number }> {
    return this.dataSource.transaction(async (manager) => {
      let program = await this.programsService.findBySourceId(data.source, data.sourceId);

      if (program) {
        program.title = data.title;
        program.description = data.description || '';
        program.thumbnailUrl = data.thumbnailUrl || '';
        program.language = data.language || 'ar';

        if (categoryIds?.length) {
          program.categories = await this.categoriesService.findByIds(categoryIds);
        }

        program = await manager.save(Program, program);

        await this.outboxService.createEntry(
          manager, 'program', program.id, EventType.UPDATED,
          this.buildProgramPayload(program),
        );

        this.logger.log(`Updated existing program: ${program.id}`);
      } else {
        program = manager.create(Program, {
          title: data.title,
          description: data.description,
          type: data.type,
          language: data.language || 'ar',
          thumbnailUrl: data.thumbnailUrl,
          status,
          source: data.source,
          sourceId: data.sourceId,
        });

        if (categoryIds?.length) {
          program.categories = await this.categoriesService.findByIds(categoryIds);
        }

        program = await manager.save(Program, program);

        await this.outboxService.createEntry(
          manager, 'program', program.id, EventType.CREATED,
          this.buildProgramPayload(program),
        );

        this.logger.log(`Created new program: ${program.id}`);
      }
      let episodesImported = 0;

      for (const episodeData of data.episodes) {
        let episode = await this.episodesService.findBySourceId(data.source, episodeData.sourceId);
        const isNewEpisode = !episode;

        if (episode) {
          episode.title = episodeData.title;
          episode.description = episodeData.description || '';
          episode.episodeNumber = episodeData.episodeNumber || 0;
          episode.seasonNumber = episodeData.seasonNumber || 0;
          episode.durationSeconds = episodeData.durationSeconds || 0;
          if (episodeData.publishDate) {
            episode.publishDate = new Date(episodeData.publishDate);
          }

          episode = await manager.save(Episode, episode);

          await this.outboxService.createEntry(
            manager, 'episode', episode.id, EventType.UPDATED,
            this.buildEpisodePayload(episode, program),
          );
        } else {
          episode = manager.create(Episode, {
            title: episodeData.title,
            description: episodeData.description,
            episodeNumber: episodeData.episodeNumber,
            seasonNumber: episodeData.seasonNumber,
            durationSeconds: episodeData.durationSeconds || 0,
            publishDate: episodeData.publishDate ? new Date(episodeData.publishDate) : null,
            status,
            source: data.source,
            sourceId: episodeData.sourceId,
            programId: program.id,
          }as DeepPartial<Episode>);

          episode = await manager.save(Episode, episode);

          await this.outboxService.createEntry(
            manager, 'episode', episode.id, EventType.CREATED,
            this.buildEpisodePayload(episode, program),
          );
        }
        if (isNewEpisode) {
          if (episodeData.audioUrl) {
            await this.mediaService.createFromUrl(
              manager, episode.id, MediaType.AUDIO, episodeData.audioUrl, 'audio/mpeg',
            );
          }

          if (episodeData.thumbnailUrl) {
            await this.mediaService.createFromUrl(
              manager, episode.id, MediaType.THUMBNAIL, episodeData.thumbnailUrl, 'image/jpeg',
            );
          }
        }

        episodesImported++;
      }

      this.logger.log(`Import complete: program=${program.id}, episodes=${episodesImported}`);

      return { program, episodesImported };
    });
  }

  private buildProgramPayload(program: Program): Record<string, any> {
    return {
      id: program.id,
      title: program.title,
      description: program.description,
      type: program.type,
      language: program.language,
      thumbnailUrl: program.thumbnailUrl,
      status: program.status,
      source: program.source,
      sourceId: program.sourceId,
      categories: program.categories?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  }

  private buildEpisodePayload(episode: Episode, program: Program): Record<string, any> {
    return {
      id: episode.id,
      title: episode.title,
      description: episode.description,
      episodeNumber: episode.episodeNumber,
      seasonNumber: episode.seasonNumber,
      durationSeconds: episode.durationSeconds,
      publishDate: episode.publishDate,
      status: episode.status,
      source: episode.source,
      sourceId: episode.sourceId,
      programId: program.id,
      programTitle: program.title,
      createdAt: episode.createdAt,
      updatedAt: episode.updatedAt,
    };
  }
}