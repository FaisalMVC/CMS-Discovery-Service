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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const episode_entity_1 = require("./entities/episode.entity");
const outbox_service_1 = require("../outbox/outbox.service");
const event_type_enum_1 = require("../common/enums/event-type.enum");
const program_entity_1 = require("../programs/entities/program.entity");
let EpisodesService = class EpisodesService {
    constructor(episodeRepository, outboxService, dataSource) {
        this.episodeRepository = episodeRepository;
        this.outboxService = outboxService;
        this.dataSource = dataSource;
    }
    async create(programId, dto) {
        return this.dataSource.transaction(async (manager) => {
            const program = await manager.findOne(program_entity_1.Program, {
                where: { id: programId },
            });
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID "${programId}" not found`);
            }
            const episode = manager.create(episode_entity_1.Episode, {
                ...dto,
                programId,
            });
            const savedEpisode = await manager.save(episode_entity_1.Episode, episode);
            await this.outboxService.createEntry(manager, 'episode', savedEpisode.id, event_type_enum_1.EventType.CREATED, this.buildPayload(savedEpisode, program));
            return savedEpisode;
        });
    }
    async findAllByProgram(programId, query) {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const [data, total] = await this.episodeRepository.findAndCount({
            where: { programId },
            relations: ['media'],
            order: { episodeNumber: 'ASC', createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const episode = await this.episodeRepository.findOne({
            where: { id },
            relations: ['media', 'program'],
        });
        if (!episode) {
            throw new common_1.NotFoundException(`Episode with ID "${id}" not found`);
        }
        return episode;
    }
    async update(id, dto) {
        return this.dataSource.transaction(async (manager) => {
            const episode = await manager.findOne(episode_entity_1.Episode, {
                where: { id },
                relations: ['program'],
            });
            if (!episode) {
                throw new common_1.NotFoundException(`Episode with ID "${id}" not found`);
            }
            if (dto.title !== undefined)
                episode.title = dto.title;
            if (dto.description !== undefined)
                episode.description = dto.description;
            if (dto.episodeNumber !== undefined)
                episode.episodeNumber = dto.episodeNumber;
            if (dto.seasonNumber !== undefined)
                episode.seasonNumber = dto.seasonNumber;
            if (dto.durationSeconds !== undefined)
                episode.durationSeconds = dto.durationSeconds;
            if (dto.publishDate !== undefined)
                episode.publishDate = new Date(dto.publishDate);
            if (dto.status !== undefined)
                episode.status = dto.status;
            const updatedEpisode = await manager.save(episode_entity_1.Episode, episode);
            await this.outboxService.createEntry(manager, 'episode', updatedEpisode.id, event_type_enum_1.EventType.UPDATED, this.buildPayload(updatedEpisode, episode.program));
            return updatedEpisode;
        });
    }
    async remove(id) {
        return this.dataSource.transaction(async (manager) => {
            const episode = await manager.findOne(episode_entity_1.Episode, {
                where: { id },
            });
            if (!episode) {
                throw new common_1.NotFoundException(`Episode with ID "${id}" not found`);
            }
            await this.outboxService.createEntry(manager, 'episode', episode.id, event_type_enum_1.EventType.DELETED, { id: episode.id, programId: episode.programId });
            await manager.remove(episode_entity_1.Episode, episode);
        });
    }
    async findBySourceId(source, sourceId) {
        return this.episodeRepository.findOne({
            where: { source, sourceId },
        });
    }
    buildPayload(episode, program) {
        return {
            id: episode.id,
            title: episode.title,
            description: episode.description,
            episodeNumber: episode.episodeNumber,
            seasonNumber: episode.seasonNumber,
            durationSeconds: episode.durationSeconds,
            publishDate: episode.publishDate,
            status: episode.status,
            source: episode.source,
            sourceId: episode.sourceId,
            programId: episode.programId,
            programTitle: program?.title || null,
            media: episode.media?.map((m) => ({
                id: m.id,
                type: m.type,
                url: m.url,
                mimeType: m.mimeType,
            })) || [],
            createdAt: episode.createdAt,
            updatedAt: episode.updatedAt,
        };
    }
};
exports.EpisodesService = EpisodesService;
exports.EpisodesService = EpisodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(episode_entity_1.Episode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        outbox_service_1.OutboxService,
        typeorm_2.DataSource])
], EpisodesService);
//# sourceMappingURL=episodes.service.js.map