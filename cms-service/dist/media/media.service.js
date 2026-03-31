"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const media_entity_1 = require("./entities/media.entity");
const minio_service_1 = require("./minio.service");
const episodes_service_1 = require("../episodes/episodes.service");
const outbox_service_1 = require("../outbox/outbox.service");
const event_type_enum_1 = require("../common/enums/event-type.enum");
let MediaService = MediaService_1 = class MediaService {
    constructor(mediaRepository, episodesService, minioService, outboxService, dataSource) {
        this.mediaRepository = mediaRepository;
        this.episodesService = episodesService;
        this.minioService = minioService;
        this.outboxService = outboxService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(MediaService_1.name);
    }
    async upload(episodeId, dto, file) {
        await this.episodesService.findOne(episodeId);
        if (!file && !dto.url) {
            throw new common_1.BadRequestException('Either a file upload or a URL must be provided');
        }
        let url;
        let mimeType;
        let sizeBytes;
        if (file) {
            const fileExtension = file.originalname.split('.').pop();
            const objectName = `${dto.type}/${(0, uuid_1.v4)()}.${fileExtension}`;
            await this.minioService.putObject(objectName, file.buffer, file.size, file.mimetype);
            url = this.minioService.buildObjectUrl(objectName);
            mimeType = file.mimetype;
            sizeBytes = file.size;
        }
        else {
            url = dto.url;
        }
        return this.dataSource.transaction(async (manager) => {
            const media = manager.create(media_entity_1.Media, {
                episodeId,
                type: dto.type,
                url,
                mimeType,
                sizeBytes,
            });
            const savedMedia = await manager.save(media_entity_1.Media, media);
            const episode = await this.episodesService.findOne(episodeId);
            episode.media.push(savedMedia);
            await this.outboxService.createEntry(manager, 'episode', savedMedia.id, event_type_enum_1.EventType.UPDATED, this.episodesService.buildPayload(episode));
            return savedMedia;
        });
    }
    async findOne(id) {
        const media = await this.mediaRepository.findOne({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID "${id}" not found`);
        }
        return media;
    }
    async remove(id) {
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
        }
        catch (error) {
            this.logger.warn(`Could not delete from MinIO: ${error.message}`);
        }
        await this.dataSource.transaction(async (manager) => {
            const episode = await this.episodesService.findOne(media.episodeId);
            const index = episode.media.findIndex(item => item.id === media.id);
            if (index !== -1) {
                episode.media.splice(index, 1);
            }
            await this.outboxService.createEntry(manager, 'episode', media.id, event_type_enum_1.EventType.UPDATED, this.episodesService.buildPayload(episode));
            await manager.remove(media_entity_1.Media, media);
        });
    }
    async createFromUrl(manager, episodeId, type, url, mimeType) {
        const media = manager.create(media_entity_1.Media, {
            episodeId,
            type,
            url,
            mimeType,
        });
        return manager.save(media_entity_1.Media, media);
    }
    buildPayload(media) {
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
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        episodes_service_1.EpisodesService,
        minio_service_1.MinioService,
        outbox_service_1.OutboxService,
        typeorm_2.DataSource])
], MediaService);
//# sourceMappingURL=media.service.js.map