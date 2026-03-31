import { DataSource } from 'typeorm';
import { ApplePodcastsStrategy } from './strategies/apple-podcasts.strategy';
import { ProgramsService } from '../programs/programs.service';
import { EpisodesService } from '../episodes/episodes.service';
import { MediaService } from '../media/media.service';
import { CategoriesService } from '../categories/categories.service';
import { OutboxService } from '../outbox/outbox.service';
import { ContentStatus } from '../common/enums/content-status.enum';
import { Program } from '../programs/entities/program.entity';
export declare class ImportService {
    private readonly applePodcastsStrategy;
    private readonly programsService;
    private readonly episodesService;
    private readonly mediaService;
    private readonly categoriesService;
    private readonly outboxService;
    private readonly dataSource;
    private readonly logger;
    private readonly strategies;
    constructor(applePodcastsStrategy: ApplePodcastsStrategy, programsService: ProgramsService, episodesService: EpisodesService, mediaService: MediaService, categoriesService: CategoriesService, outboxService: OutboxService, dataSource: DataSource);
    import(source: string, config: Record<string, any>, status?: ContentStatus, categoryIds?: string[]): Promise<{
        program: Program;
        episodesImported: number;
    }>;
    private persistImport;
    private buildProgramPayload;
    private buildEpisodePayload;
}
