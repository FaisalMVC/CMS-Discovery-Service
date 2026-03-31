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
var ProgramsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const programs_repository_1 = require("./programs.repository");
const episodes_repository_1 = require("../episodes/episodes.repository");
const cache_service_1 = require("../cache/cache.service");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
const constants_1 = require("../common/constants");
const cache_key_util_1 = require("../common/utils/cache-key.util");
let ProgramsService = ProgramsService_1 = class ProgramsService {
    constructor(programsRepository, episodesRepository, cacheService) {
        this.programsRepository = programsRepository;
        this.episodesRepository = episodesRepository;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(ProgramsService_1.name);
    }
    async findAll(query) {
        const cacheKey = (0, cache_key_util_1.buildCacheKey)(constants_1.CACHE_PREFIXES.PROGRAM_LIST, query);
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const { hits, total } = await this.programsRepository.search({
            page: query.page,
            limit: query.limit,
            category: query.category,
            language: query.language,
            type: query.type,
            status: query.status,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
        const result = paginated_response_dto_1.PaginatedResponse.create(hits, total, query.page, query.limit);
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.PROGRAM_LIST);
        return result;
    }
    async findById(id) {
        const cacheKey = `${constants_1.CACHE_PREFIXES.PROGRAM_DETAIL}:${id}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const program = await this.programsRepository.findById(id);
        if (!program) {
            throw new common_1.NotFoundException(`Program with ID "${id}" not found`);
        }
        const { hits: latestEpisodes } = await this.episodesRepository.search({
            programId: id,
            status: 'published',
            page: 1,
            limit: 5,
            sortBy: 'publishDate',
            sortOrder: 'desc',
        });
        const result = {
            data: {
                ...program,
                latestEpisodes: latestEpisodes.map((ep) => ({
                    id: ep.id,
                    title: ep.title,
                    episodeNumber: ep.episodeNumber,
                    seasonNumber: ep.seasonNumber,
                    durationSeconds: ep.durationSeconds,
                    publishDate: ep.publishDate,
                })),
            },
        };
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.PROGRAM_DETAIL);
        return result;
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = ProgramsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [programs_repository_1.ProgramsRepository,
        episodes_repository_1.EpisodesRepository,
        cache_service_1.CacheService])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map