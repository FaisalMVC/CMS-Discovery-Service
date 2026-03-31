import { ProgramsRepository } from '../../programs/programs.repository';
import { EpisodesRepository } from '../../episodes/episodes.repository';
import { CacheService } from '../../cache/cache.service';
import { ProgramPayload } from '../dto/cms-event.dto';
export declare class ProgramEventHandler {
    private readonly programsRepository;
    private readonly episodesRepository;
    private readonly cacheService;
    private readonly logger;
    constructor(programsRepository: ProgramsRepository, episodesRepository: EpisodesRepository, cacheService: CacheService);
    handle(eventType: string, payload: ProgramPayload): Promise<void>;
    private handleUpsert;
    private handleDelete;
    private invalidateCache;
}
