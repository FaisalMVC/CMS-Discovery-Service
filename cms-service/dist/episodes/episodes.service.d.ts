import { Repository, DataSource } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OutboxService } from '../outbox/outbox.service';
import { Program } from '../programs/entities/program.entity';
export declare class EpisodesService {
    private readonly episodeRepository;
    private readonly outboxService;
    private readonly dataSource;
    constructor(episodeRepository: Repository<Episode>, outboxService: OutboxService, dataSource: DataSource);
    create(programId: string, dto: CreateEpisodeDto): Promise<Episode>;
    findAllByProgram(programId: string, query: PaginationQueryDto): Promise<{
        data: Episode[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Episode>;
    update(id: string, dto: UpdateEpisodeDto): Promise<Episode>;
    remove(id: string): Promise<void>;
    findBySourceId(source: string, sourceId: string): Promise<Episode | null>;
    buildPayload(episode: Episode, program?: Program): Record<string, any>;
}
