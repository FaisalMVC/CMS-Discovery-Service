import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProgramsRepository } from './programs.repository';
import { EpisodesRepository } from '../episodes/episodes.repository';
import { CacheService } from '../cache/cache.service';
import { ListProgramsQueryDto } from './dto/list-programs-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
import { CACHE_PREFIXES, CACHE_TTL } from '../common/constants';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class ProgramsService {
  private readonly logger = new Logger(ProgramsService.name);

  constructor(
    private readonly programsRepository: ProgramsRepository,
    private readonly episodesRepository: EpisodesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(query: ListProgramsQueryDto): Promise<PaginatedResponse<any>> {
    const cacheKey = buildCacheKey(CACHE_PREFIXES.PROGRAM_LIST, query);

    const cached = await this.cacheService.get<PaginatedResponse<any>>(cacheKey);
    if (cached) return cached;

    const { hits, total } = await this.programsRepository.search({
      page: query.page,
      limit: query.limit,
      category: query.category,
      language: query.language,
      type: query.type,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    const result = PaginatedResponse.create(hits, total, query.page, query.limit);

    await this.cacheService.set(cacheKey, result, CACHE_TTL.PROGRAM_LIST);

    return result;
  }

  async findById(id: string): Promise<any> {
    const cacheKey = `${CACHE_PREFIXES.PROGRAM_DETAIL}:${id}`;

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const program = await this.programsRepository.findById(id);

    if (!program) {
      throw new NotFoundException(`Program with ID "${id}" not found`);
    }

    // Fetch latest 5 episodes using msearch would be ideal,
    // but for clarity we do a separate query
    const { hits: latestEpisodes } = await this.episodesRepository.search({
      programId: id,
      status: 'published',
      page: 1,
      limit: 5,
      sortBy: 'publishDate',
      sortOrder: 'desc',
    });

    const result = {
      data: {
        ...program,
        latestEpisodes: latestEpisodes.map((ep) => ({
          id: ep.id,
          title: ep.title,
          episodeNumber: ep.episodeNumber,
          seasonNumber: ep.seasonNumber,
          durationSeconds: ep.durationSeconds,
          publishDate: ep.publishDate,
        })),
      },
    };

    await this.cacheService.set(cacheKey, result, CACHE_TTL.PROGRAM_DETAIL);

    return result;
  }
}
