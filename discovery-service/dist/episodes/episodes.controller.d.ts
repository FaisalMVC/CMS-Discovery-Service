import { EpisodesService } from './episodes.service';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto';
export declare class EpisodesController {
    private readonly episodesService;
    constructor(episodesService: EpisodesService);
    findByProgramId(programId: string, query: ListEpisodesQueryDto): Promise<import("../common/dto/paginated-response.dto").PaginatedResponse<any>>;
    findById(id: string): Promise<any>;
}
