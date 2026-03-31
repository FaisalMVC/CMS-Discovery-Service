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
var EpisodeEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeEventHandler = void 0;
const common_1 = require("@nestjs/common");
const episodes_repository_1 = require("../../episodes/episodes.repository");
const programs_repository_1 = require("../../programs/programs.repository");
const cache_service_1 = require("../../cache/cache.service");
const constants_1 = require("../../common/constants");
let EpisodeEventHandler = EpisodeEventHandler_1 = class EpisodeEventHandler {
    constructor(episodesRepository, programsRepository, cacheService) {
        this.episodesRepository = episodesRepository;
        this.programsRepository = programsRepository;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(EpisodeEventHandler_1.name);
    }
    async handle(eventType, payload) {
        this.logger.log(`Handling ${eventType} for episode ${payload.id}`);
        switch (eventType) {
            case constants_1.EVENT_TYPES.EPISODE_CREATED:
            case constants_1.EVENT_TYPES.EPISODE_UPDATED:
                await this.handleUpsert(payload);
                break;
            case constants_1.EVENT_TYPES.EPISODE_DELETED:
                await this.handleDelete(payload);
                break;
            default:
                this.logger.warn(`Unknown episode event type: ${eventType}`);
        }
    }
    async handleUpsert(payload) {
        const document = {
            id: payload.id,
            programId: payload.programId,
            programTitle: payload.programTitle,
            title: payload.title,
            description: payload.description,
            episodeNumber: payload.episodeNumber,
            seasonNumber: payload.seasonNumber,
            durationSeconds: payload.durationSeconds,
            publishDate: payload.publishDate,
            status: payload.status,
            source: payload.source,
            sourceId: payload.sourceId,
            media: payload.media || [],
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        };
        await this.episodesRepository.upsert(payload.id, document);
        await this.updateProgramEpisodeCount(payload.programId);
        await this.invalidateCache(payload.id, payload.programId);
        this.logger.log(`Episode ${payload.id} indexed successfully`);
    }
    async handleDelete(payload) {
        const programId = payload.programId;
        await this.episodesRepository.delete(payload.id);
        await this.updateProgramEpisodeCount(programId);
        await this.invalidateCache(payload.id, programId);
        this.logger.log(`Episode ${payload.id} deleted from index`);
    }
    async updateProgramEpisodeCount(programId) {
        if (!programId)
            return;
        try {
            const count = await this.episodesRepository.countByProgramId(programId);
            await this.programsRepository.updatePartial(programId, { episodeCount: count });
            this.logger.debug(`Updated episodeCount for program ${programId} to ${count}`);
        }
        catch (error) {
            this.logger.warn(`Failed to update episode count for program ${programId}: ${error.message}`);
        }
    }
    async invalidateCache(episodeId, programId) {
        await this.cacheService.del(`${constants_1.CACHE_PREFIXES.EPISODE_DETAIL}:${episodeId}`);
        await this.cacheService.delByPattern(`${constants_1.CACHE_PREFIXES.PROGRAM_EPISODES}:${programId}:*`);
        await this.cacheService.del(`${constants_1.CACHE_PREFIXES.PROGRAM_DETAIL}:${programId}`);
    }
};
exports.EpisodeEventHandler = EpisodeEventHandler;
exports.EpisodeEventHandler = EpisodeEventHandler = EpisodeEventHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [episodes_repository_1.EpisodesRepository,
        programs_repository_1.ProgramsRepository,
        cache_service_1.CacheService])
], EpisodeEventHandler);
//# sourceMappingURL=episode-event.handler.js.map