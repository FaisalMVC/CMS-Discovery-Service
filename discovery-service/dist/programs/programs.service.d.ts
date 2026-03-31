import { ProgramsRepository } from './programs.repository';
import { EpisodesRepository } from '../episodes/episodes.repository';
import { CacheService } from '../cache/cache.service';
import { ListProgramsQueryDto } from './dto/list-programs-query.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
export declare class ProgramsService {
    private readonly programsRepository;
    private readonly episodesRepository;
    private readonly cacheService;
    private readonly logger;
    constructor(programsRepository: ProgramsRepository, episodesRepository: EpisodesRepository, cacheService: CacheService);
    findAll(query: ListProgramsQueryDto): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<any>;
}
