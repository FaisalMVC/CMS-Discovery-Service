import { Injectable, Logger } from '@nestjs/common';
import { EpisodesRepository } from '../../episodes/episodes.repository';
import { ProgramsRepository } from '../../programs/programs.repository';
import { CacheService } from '../../cache/cache.service';
import { EpisodePayload } from '../dto/cms-event.dto';
import { CACHE_PREFIXES, EVENT_TYPES } from '../../common/constants';

@Injectable()
export class EpisodeEventHandler {
  private readonly logger = new Logger(EpisodeEventHandler.name);

  constructor(
    private readonly episodesRepository: EpisodesRepository,
    private readonly programsRepository: ProgramsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async handle(eventType: string, payload: EpisodePayload): Promise<void> {
    this.logger.log(`Handling ${eventType} for episode ${payload.id}`);

    switch (eventType) {
      case EVENT_TYPES.EPISODE_CREATED:
      case EVENT_TYPES.EPISODE_UPDATED:
        await this.handleUpsert(payload);
        break;

      case EVENT_TYPES.EPISODE_DELETED:
        await this.handleDelete(payload);
        break;

      default:
        this.logger.warn(`Unknown episode event type: ${eventType}`);
    }
  }

  private async handleUpsert(payload: EpisodePayload): Promise<void> {
    const document = {
      id: payload.id,
      programId: payload.programId,
      programTitle: payload.programTitle,
      title: payload.title,
      description: payload.description,
      episodeNumber: payload.episodeNumber,
      seasonNumber: payload.seasonNumber,
      durationSeconds: payload.durationSeconds,
      publishDate: payload.publishDate,
      status: payload.status,
      source: payload.source,
      sourceId: payload.sourceId,
      media: payload.media || [],
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    await this.episodesRepository.upsert(payload.id, document);
    await this.updateProgramEpisodeCount(payload.programId);
    await this.invalidateCache(payload.id, payload.programId);

    this.logger.log(`Episode ${payload.id} indexed successfully`);
  }

  private async handleDelete(payload: EpisodePayload): Promise<void> {
    const programId = payload.programId;

    await this.episodesRepository.delete(payload.id);
    await this.updateProgramEpisodeCount(programId);
    await this.invalidateCache(payload.id, programId);

    this.logger.log(`Episode ${payload.id} deleted from index`);
  }

  private async updateProgramEpisodeCount(programId: string): Promise<void> {
    if (!programId) return;

    try {
      const count = await this.episodesRepository.countByProgramId(programId);
      await this.programsRepository.updatePartial(programId, { episodeCount: count });
      this.logger.debug(`Updated episodeCount for program ${programId} to ${count}`);
    } catch (error) {
      this.logger.warn(
        `Failed to update episode count for program ${programId}: ${error.message}`,
      );
    }
  }

  private async invalidateCache(episodeId: string, programId: string): Promise<void> {
    await this.cacheService.del(`${CACHE_PREFIXES.EPISODE_DETAIL}:${episodeId}`);
    await this.cacheService.delByPattern(`${CACHE_PREFIXES.PROGRAM_EPISODES}:${programId}:*`);
    await this.cacheService.del(`${CACHE_PREFIXES.PROGRAM_DETAIL}:${programId}`);
  }
}
