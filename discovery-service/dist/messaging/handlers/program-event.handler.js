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
var ProgramEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramEventHandler = void 0;
const common_1 = require("@nestjs/common");
const programs_repository_1 = require("../../programs/programs.repository");
const episodes_repository_1 = require("../../episodes/episodes.repository");
const cache_service_1 = require("../../cache/cache.service");
const constants_1 = require("../../common/constants");
let ProgramEventHandler = ProgramEventHandler_1 = class ProgramEventHandler {
    constructor(programsRepository, episodesRepository, cacheService) {
        this.programsRepository = programsRepository;
        this.episodesRepository = episodesRepository;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(ProgramEventHandler_1.name);
    }
    async handle(eventType, payload) {
        this.logger.log(`Handling ${eventType} for program ${payload.id}`);
        switch (eventType) {
            case constants_1.EVENT_TYPES.PROGRAM_CREATED:
            case constants_1.EVENT_TYPES.PROGRAM_UPDATED:
                await this.handleUpsert(payload);
                break;
            case constants_1.EVENT_TYPES.PROGRAM_DELETED:
                await this.handleDelete(payload.id);
                break;
            default:
                this.logger.warn(`Unknown program event type: ${eventType}`);
        }
    }
    async handleUpsert(payload) {
        const episodeCount = await this.episodesRepository.countByProgramId(payload.id);
        const document = {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            type: payload.type,
            language: payload.language,
            thumbnailUrl: payload.thumbnailUrl,
            status: payload.status,
            source: payload.source,
            sourceId: payload.sourceId,
            categories: payload.categories || [],
            episodeCount,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
        };
        await this.programsRepository.upsert(payload.id, document);
        await this.invalidateCache(payload.id);
        this.logger.log(`Program ${payload.id} indexed successfully`);
    }
    async handleDelete(programId) {
        await this.programsRepository.delete(programId);
        await this.episodesRepository.deleteByProgramId(programId);
        await this.invalidateCache(programId);
        this.logger.log(`Program ${programId} and its episodes deleted from index`);
    }
    async invalidateCache(programId) {
        await this.cacheService.del(`${constants_1.CACHE_PREFIXES.PROGRAM_DETAIL}:${programId}`);
        await this.cacheService.delByPattern(`${constants_1.CACHE_PREFIXES.PROGRAM_LIST}:*`);
        await this.cacheService.delByPattern(`${constants_1.CACHE_PREFIXES.CATEGORIES}:*`);
    }
};
exports.ProgramEventHandler = ProgramEventHandler;
exports.ProgramEventHandler = ProgramEventHandler = ProgramEventHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [programs_repository_1.ProgramsRepository,
        episodes_repository_1.EpisodesRepository,
        cache_service_1.CacheService])
], ProgramEventHandler);
//# sourceMappingURL=program-event.handler.js.map