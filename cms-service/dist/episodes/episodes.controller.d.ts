import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class EpisodesController {
    private readonly episodesService;
    constructor(episodesService: EpisodesService);
    create(programId: string, dto: CreateEpisodeDto): Promise<import("./entities/episode.entity").Episode>;
    findAllByProgram(programId: string, query: PaginationQueryDto): Promise<{
        data: import("./entities/episode.entity").Episode[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/episode.entity").Episode>;
    update(id: string, dto: UpdateEpisodeDto): Promise<import("./entities/episode.entity").Episode>;
    remove(id: string): Promise<void>;
}
