import { EpisodesRepository } from '../../episodes/episodes.repository';
import { ProgramsRepository } from '../../programs/programs.repository';
import { CacheService } from '../../cache/cache.service';
import { EpisodePayload } from '../dto/cms-event.dto';
export declare class EpisodeEventHandler {
    private readonly episodesRepository;
    private readonly programsRepository;
    private readonly cacheService;
    private readonly logger;
    constructor(episodesRepository: EpisodesRepository, programsRepository: ProgramsRepository, cacheService: CacheService);
    handle(eventType: string, payload: EpisodePayload): Promise<void>;
    private handleUpsert;
    private handleDelete;
    private updateProgramEpisodeCount;
    private invalidateCache;
}
