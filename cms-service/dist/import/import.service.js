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
var ImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const apple_podcasts_strategy_1 = require("./strategies/apple-podcasts.strategy");
const programs_service_1 = require("../programs/programs.service");
const episodes_service_1 = require("../episodes/episodes.service");
const media_service_1 = require("../media/media.service");
const categories_service_1 = require("../categories/categories.service");
const outbox_service_1 = require("../outbox/outbox.service");
const event_type_enum_1 = require("../common/enums/event-type.enum");
const content_status_enum_1 = require("../common/enums/content-status.enum");
const program_entity_1 = require("../programs/entities/program.entity");
const episode_entity_1 = require("../episodes/entities/episode.entity");
const media_type_enum_1 = require("../common/enums/media-type.enum");
let ImportService = ImportService_1 = class ImportService {
    constructor(applePodcastsStrategy, programsService, episodesService, mediaService, categoriesService, outboxService, dataSource) {
        this.applePodcastsStrategy = applePodcastsStrategy;
        this.programsService = programsService;
        this.episodesService = episodesService;
        this.mediaService = mediaService;
        this.categoriesService = categoriesService;
        this.outboxService = outboxService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(ImportService_1.name);
        this.strategies = new Map([
            ['apple_podcasts', this.applePodcastsStrategy],
        ]);
    }
    async import(source, config, status, categoryIds) {
        const strategy = this.strategies.get(source);
        if (!strategy) {
            throw new common_1.BadRequestException(`Unknown import source: "${source}". Available: ${[...this.strategies.keys()].join(', ')}`);
        }
        this.logger.log(`Starting import from source: ${source}`);
        const normalizedData = await strategy.fetch(config);
        return this.persistImport(normalizedData, status ?? content_status_enum_1.ContentStatus.DRAFT, categoryIds);
    }
    async persistImport(data, status, categoryIds) {
        return this.dataSource.transaction(async (manager) => {
            let program = await this.programsService.findBySourceId(data.source, data.sourceId);
            if (program) {
                program.title = data.title;
                program.description = data.description || '';
                program.thumbnailUrl = data.thumbnailUrl || '';
                program.language = data.language || 'ar';
                if (categoryIds?.length) {
                    program.categories = await this.categoriesService.findByIds(categoryIds);
                }
                program = await manager.save(program_entity_1.Program, program);
                await this.outboxService.createEntry(manager, 'program', program.id, event_type_enum_1.EventType.UPDATED, this.buildProgramPayload(program));
                this.logger.log(`Updated existing program: ${program.id}`);
            }
            else {
                program = manager.create(program_entity_1.Program, {
                    title: data.title,
                    description: data.description,
                    type: data.type,
                    language: data.language || 'ar',
                    thumbnailUrl: data.thumbnailUrl,
                    status,
                    source: data.source,
                    sourceId: data.sourceId,
                });
                if (categoryIds?.length) {
                    program.categories = await this.categoriesService.findByIds(categoryIds);
                }
                program = await manager.save(program_entity_1.Program, program);
                await this.outboxService.createEntry(manager, 'program', program.id, event_type_enum_1.EventType.CREATED, this.buildProgramPayload(program));
                this.logger.log(`Created new program: ${program.id}`);
            }
            let episodesImported = 0;
            for (const episodeData of data.episodes) {
                let episode = await this.episodesService.findBySourceId(data.source, episodeData.sourceId);
                const isNewEpisode = !episode;
                if (episode) {
                    episode.title = episodeData.title;
                    episode.description = episodeData.description || '';
                    episode.episodeNumber = episodeData.episodeNumber || 0;
                    episode.seasonNumber = episodeData.seasonNumber || 0;
                    episode.durationSeconds = episodeData.durationSeconds || 0;
                    if (episodeData.publishDate) {
                        episode.publishDate = new Date(episodeData.publishDate);
                    }
                    episode = await manager.save(episode_entity_1.Episode, episode);
                    await this.outboxService.createEntry(manager, 'episode', episode.id, event_type_enum_1.EventType.UPDATED, this.buildEpisodePayload(episode, program));
                }
                else {
                    episode = manager.create(episode_entity_1.Episode, {
                        title: episodeData.title,
                        description: episodeData.description,
                        episodeNumber: episodeData.episodeNumber,
                        seasonNumber: episodeData.seasonNumber,
                        durationSeconds: episodeData.durationSeconds || 0,
                        publishDate: episodeData.publishDate ? new Date(episodeData.publishDate) : null,
                        status,
                        source: data.source,
                        sourceId: episodeData.sourceId,
                        programId: program.id,
                    });
                    episode = await manager.save(episode_entity_1.Episode, episode);
                    await this.outboxService.createEntry(manager, 'episode', episode.id, event_type_enum_1.EventType.CREATED, this.buildEpisodePayload(episode, program));
                }
                if (isNewEpisode) {
                    if (episodeData.audioUrl) {
                        await this.mediaService.createFromUrl(manager, episode.id, media_type_enum_1.MediaType.AUDIO, episodeData.audioUrl, 'audio/mpeg');
                    }
                    if (episodeData.thumbnailUrl) {
                        await this.mediaService.createFromUrl(manager, episode.id, media_type_enum_1.MediaType.THUMBNAIL, episodeData.thumbnailUrl, 'image/jpeg');
                    }
                }
                episodesImported++;
            }
            this.logger.log(`Import complete: program=${program.id}, episodes=${episodesImported}`);
            return { program, episodesImported };
        });
    }
    buildProgramPayload(program) {
        return {
            id: program.id,
            title: program.title,
            description: program.description,
            type: program.type,
            language: program.language,
            thumbnailUrl: program.thumbnailUrl,
            status: program.status,
            source: program.source,
            sourceId: program.sourceId,
            categories: program.categories?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
        };
    }
    buildEpisodePayload(episode, program) {
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
            programId: program.id,
            programTitle: program.title,
            createdAt: episode.createdAt,
            updatedAt: episode.updatedAt,
        };
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = ImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [apple_podcasts_strategy_1.ApplePodcastsStrategy,
        programs_service_1.ProgramsService,
        episodes_service_1.EpisodesService,
        media_service_1.MediaService,
        categories_service_1.CategoriesService,
        outbox_service_1.OutboxService,
        typeorm_1.DataSource])
], ImportService);
//# sourceMappingURL=import.service.js.map