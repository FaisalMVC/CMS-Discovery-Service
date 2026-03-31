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
var EpisodesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesService = void 0;
const common_1 = require("@nestjs/common");
const episodes_repository_1 = require("./episodes.repository");
const cache_service_1 = require("../cache/cache.service");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
const constants_1 = require("../common/constants");
const cache_key_util_1 = require("../common/utils/cache-key.util");
let EpisodesService = EpisodesService_1 = class EpisodesService {
    constructor(episodesRepository, cacheService) {
        this.episodesRepository = episodesRepository;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(EpisodesService_1.name);
    }
    async findByProgramId(programId, query) {
        const cacheKey = (0, cache_key_util_1.buildCacheKey)(`${constants_1.CACHE_PREFIXES.PROGRAM_EPISODES}:${programId}`, query);
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const { hits, total } = await this.episodesRepository.search({
            programId,
            status: query.status,
            season: query.season,
            page: query.page,
            limit: query.limit,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
        const result = paginated_response_dto_1.PaginatedResponse.create(hits, total, query.page, query.limit);
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.PROGRAM_EPISODES);
        return result;
    }
    async findById(id) {
        const cacheKey = `${constants_1.CACHE_PREFIXES.EPISODE_DETAIL}:${id}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const episode = await this.episodesRepository.findById(id);
        if (!episode) {
            throw new common_1.NotFoundException(`Episode with ID "${id}" not found`);
        }
        const result = { data: episode };
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.EPISODE_DETAIL);
        return result;
    }
};
exports.EpisodesService = EpisodesService;
exports.EpisodesService = EpisodesService = EpisodesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [episodes_repository_1.EpisodesRepository,
        cache_service_1.CacheService])
], EpisodesService);
//# sourceMappingURL=episodes.service.js.map