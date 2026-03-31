import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EpisodesRepository } from './episodes.repository';
import { CacheService } from '../cache/cache.service';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { CACHE_PREFIXES, CACHE_TTL } from '../common/constants';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class EpisodesService {
  private readonly logger = new Logger(EpisodesService.name);

  constructor(
    private readonly episodesRepository: EpisodesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findByProgramId(
    programId: string,
    query: ListEpisodesQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const cacheKey = buildCacheKey(
      `${CACHE_PREFIXES.PROGRAM_EPISODES}:${programId}`,
      query,
    );

    const cached = await this.cacheService.get<PaginatedResponse<any>>(cacheKey);
    if (cached) return cached;

    const { hits, total } = await this.episodesRepository.search({
      programId,
      status: query.status,
      season: query.season,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    const result = PaginatedResponse.create(hits, total, query.page, query.limit);

    await this.cacheService.set(cacheKey, result, CACHE_TTL.PROGRAM_EPISODES);

    return result;
  }

  async findById(id: string): Promise<any> {
    const cacheKey = `${CACHE_PREFIXES.EPISODE_DETAIL}:${id}`;

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const episode = await this.episodesRepository.findById(id);

    if (!episode) {
      throw new NotFoundException(`Episode with ID "${id}" not found`);
    }

    const result = { data: episode };

    await this.cacheService.set(cacheKey, result, CACHE_TTL.EPISODE_DETAIL);

    return result;
  }
}
