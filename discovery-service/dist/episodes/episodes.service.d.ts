import { EpisodesRepository } from './episodes.repository';
import { CacheService } from '../cache/cache.service';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
export declare class EpisodesService {
    private readonly episodesRepository;
    private readonly cacheService;
    private readonly logger;
    constructor(episodesRepository: EpisodesRepository, cacheService: CacheService);
    findByProgramId(programId: string, query: ListEpisodesQueryDto): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<any>;
}
