import { Repository, DataSource, EntityManager } from 'typeorm';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaType } from '../common/enums/media-type.enum';
import { MinioService } from './minio.service';
import { EpisodesService } from '../episodes/episodes.service';
import { OutboxService } from '../outbox/outbox.service';
export declare class MediaService {
    private readonly mediaRepository;
    private readonly episodesService;
    private readonly minioService;
    private readonly outboxService;
    private readonly dataSource;
    private readonly logger;
    constructor(mediaRepository: Repository<Media>, episodesService: EpisodesService, minioService: MinioService, outboxService: OutboxService, dataSource: DataSource);
    upload(episodeId: string, dto: CreateMediaDto, file?: Express.Multer.File): Promise<Media>;
    findOne(id: string): Promise<Media>;
    remove(id: string): Promise<void>;
    createFromUrl(manager: EntityManager, episodeId: string, type: MediaType, url: string, mimeType?: string): Promise<Media>;
    private buildPayload;
}
