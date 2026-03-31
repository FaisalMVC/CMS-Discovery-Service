import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, DataSource, EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaType } from '../common/enums/media-type.enum';
import { MinioService } from './minio.service';
import { EpisodesService } from '../episodes/episodes.service';
import { OutboxService } from '../outbox/outbox.service';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly episodesService: EpisodesService,
    private readonly minioService: MinioService,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
  ) {}

  async upload(
    episodeId: string,
    dto: CreateMediaDto,
    file?: Express.Multer.File,
  ): Promise<Media> {
    await this.episodesService.findOne(episodeId);

    if (!file && !dto.url) {
      throw new BadRequestException('Either a file upload or a URL must be provided');
    }

    let url: string;
    let mimeType: string | undefined;
    let sizeBytes: number | undefined;
    if (file) {
      const fileExtension = file.originalname.split('.').pop();
      const objectName = `${dto.type}/${uuidv4()}.${fileExtension}`;

      await this.minioService.putObject(objectName, file.buffer, file.size, file.mimetype);

      url = this.minioService.buildObjectUrl(objectName);
      mimeType = file.mimetype;
      sizeBytes = file.size;
    } else {
      url = dto.url!;
    }

    return this.dataSource.transaction(async (manager) => {
      const media = manager.create(Media, {
        episodeId,
        type: dto.type as MediaType,
        url,
        mimeType,
        sizeBytes,
      } as DeepPartial<Media>);

      const savedMedia = await manager.save(Media, media);
      const episode =  await this.episodesService.findOne(episodeId);
      episode.media.push(savedMedia);
      await this.outboxService.createEntry(
        manager,
        'episode',
        savedMedia.id,
        EventType.UPDATED,
        this.episodesService.buildPayload(episode),
      );

      return savedMedia;
    });
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });

    if (!media) {
      throw new NotFoundException(`Media with ID "${id}" not found`);
    }

    return media;
  }

  async remove(id: string): Promise<void> {
    const media = await this.findOne(id);
    try {
      const urlObj = new URL(media.url);
      const objectName = urlObj.pathname
        .replace(`/${this.minioService.getBucketName()}/`, '')
        .replace(/^\//, '');

      if (objectName && media.url.includes(this.minioService.getBucketName())) {
        await this.minioService.removeObject(objectName);
        this.logger.log(`Deleted object from MinIO: ${objectName}`);
      }
    } catch (error) {
      this.logger.warn(`Could not delete from MinIO: ${error.message}`);
    }

    await this.dataSource.transaction(async (manager) => {
      const episode =  await this.episodesService.findOne(media.episodeId);
      const index = episode.media.findIndex(item => item.id === media.id);

      if (index !== -1) {
        episode.media.splice(index, 1); 
      }
      await this.outboxService.createEntry(
        manager,
        'episode',
        media.id,
        EventType.UPDATED,
        this.episodesService.buildPayload(episode),
      );
      await manager.remove(Media, media);
    });
  }
  async createFromUrl(
    manager: EntityManager,
    episodeId: string,
    type: MediaType,
    url: string,
    mimeType?: string,
  ): Promise<Media> {
    const media = manager.create(Media, {
      episodeId,
      type,
      url,
      mimeType,
    } as DeepPartial<Media>);

    return manager.save(Media, media);
  }

  private buildPayload(media: Media): Record<string, any> {
    return {
      id: media.id,
      episodeId: media.episodeId,
      type: media.type,
      url: media.url,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      createdAt: media.createdAt,
    };
  }
}