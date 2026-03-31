import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OutboxService } from '../outbox/outbox.service';
import { EventType } from '../common/enums/event-type.enum';
import { Program } from '../programs/entities/program.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
  ) {}

  async create(programId: string, dto: CreateEpisodeDto): Promise<Episode> {
    return this.dataSource.transaction(async (manager) => {
      // Verify program exists
      const program = await manager.findOne(Program, {
        where: { id: programId },
      });

      if (!program) {
        throw new NotFoundException(`Program with ID "${programId}" not found`);
      }

      const episode = manager.create(Episode, {
        ...dto,
        programId,
      });

      const savedEpisode = await manager.save(Episode, episode);

      await this.outboxService.createEntry(
        manager,
        'episode',
        savedEpisode.id,
        EventType.CREATED,
        this.buildPayload(savedEpisode, program),
      );

      return savedEpisode;
    });
  }

  async findAllByProgram(programId: string, query: PaginationQueryDto) {
    const { page = 1, limit =20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.episodeRepository.findAndCount({
      where: { programId },
      relations: ['media'],
      order: { episodeNumber: 'ASC', createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({
      where: { id },
      relations: ['media', 'program'],
    });

    if (!episode) {
      throw new NotFoundException(`Episode with ID "${id}" not found`);
    }

    return episode;
  }

  async update(id: string, dto: UpdateEpisodeDto): Promise<Episode> {
    return this.dataSource.transaction(async (manager) => {
      const episode = await manager.findOne(Episode, {
        where: { id },
        relations: ['program'],
      });

      if (!episode) {
        throw new NotFoundException(`Episode with ID "${id}" not found`);
      }

      if (dto.title !== undefined) episode.title = dto.title;
      if (dto.description !== undefined) episode.description = dto.description;
      if (dto.episodeNumber !== undefined) episode.episodeNumber = dto.episodeNumber;
      if (dto.seasonNumber !== undefined) episode.seasonNumber = dto.seasonNumber;
      if (dto.durationSeconds !== undefined) episode.durationSeconds = dto.durationSeconds;
      if (dto.publishDate !== undefined) episode.publishDate = new Date(dto.publishDate);
      if (dto.status !== undefined) episode.status = dto.status;

      const updatedEpisode = await manager.save(Episode, episode);

      await this.outboxService.createEntry(
        manager,
        'episode',
        updatedEpisode.id,
        EventType.UPDATED,
        this.buildPayload(updatedEpisode, episode.program),
      );

      return updatedEpisode;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const episode = await manager.findOne(Episode, {
        where: { id },
      });

      if (!episode) {
        throw new NotFoundException(`Episode with ID "${id}" not found`);
      }

      await this.outboxService.createEntry(
        manager,
        'episode',
        episode.id,
        EventType.DELETED,
        { id: episode.id, programId: episode.programId },
      );

      await manager.remove(Episode, episode);
    });
  }
  async findBySourceId(source: string, sourceId: string): Promise<Episode | null> {
    return this.episodeRepository.findOne({
      where: { source, sourceId },
    });
  }

  public buildPayload(episode: Episode, program?: Program): Record<string, any> {
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
      programId: episode.programId,
      programTitle: program?.title || null,
      media: episode.media?.map((m) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        mimeType: m.mimeType,
      })) || [],
      createdAt: episode.createdAt,
      updatedAt: episode.updatedAt,
    };
  }
}
