import { Injectable, Logger } from '@nestjs/common';
import { ProgramsRepository } from '../../programs/programs.repository';
import { EpisodesRepository } from '../../episodes/episodes.repository';
import { CacheService } from '../../cache/cache.service';
import { ProgramPayload } from '../dto/cms-event.dto';
import { CACHE_PREFIXES, EVENT_TYPES } from '../../common/constants';

@Injectable()
export class ProgramEventHandler {
  private readonly logger = new Logger(ProgramEventHandler.name);

  constructor(
    private readonly programsRepository: ProgramsRepository,
    private readonly episodesRepository: EpisodesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async handle(eventType: string, payload: ProgramPayload): Promise<void> {
    this.logger.log(`Handling ${eventType} for program ${payload.id}`);

    switch (eventType) {
      case EVENT_TYPES.PROGRAM_CREATED:
      case EVENT_TYPES.PROGRAM_UPDATED:
        await this.handleUpsert(payload);
        break;

      case EVENT_TYPES.PROGRAM_DELETED:
        await this.handleDelete(payload.id);
        break;

      default:
        this.logger.warn(`Unknown program event type: ${eventType}`);
    }
  }

  private async handleUpsert(payload: ProgramPayload): Promise<void> {
    const episodeCount = await this.episodesRepository.countByProgramId(payload.id);

    const document = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      language: payload.language,
      thumbnailUrl: payload.thumbnailUrl,
      status: payload.status,
      source: payload.source,
      sourceId: payload.sourceId,
      categories: payload.categories || [],
      episodeCount,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    await this.programsRepository.upsert(payload.id, document);
    await this.invalidateCache(payload.id);

    this.logger.log(`Program ${payload.id} indexed successfully`);
  }

  private async handleDelete(programId: string): Promise<void> {
    await this.programsRepository.delete(programId);
    await this.episodesRepository.deleteByProgramId(programId);
    await this.invalidateCache(programId);

    this.logger.log(`Program ${programId} and its episodes deleted from index`);
  }

  private async invalidateCache(programId: string): Promise<void> {
    await this.cacheService.del(`${CACHE_PREFIXES.PROGRAM_DETAIL}:${programId}`);
    await this.cacheService.delByPattern(`${CACHE_PREFIXES.PROGRAM_LIST}:*`);
    await this.cacheService.delByPattern(`${CACHE_PREFIXES.CATEGORIES}:*`);
  }
}
