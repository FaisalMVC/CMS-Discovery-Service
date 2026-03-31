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
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
const cache_service_1 = require("../cache/cache.service");
const cache_key_util_1 = require("../common/utils/cache-key.util");
let SearchService = SearchService_1 = class SearchService {
    constructor(client, cacheService) {
        this.client = client;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(SearchService_1.name);
    }
    async search(query) {
        const cacheKey = (0, cache_key_util_1.buildCacheKey)(constants_1.CACHE_PREFIXES.SEARCH, query);
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const from = (query.page - 1) * query.limit;
        const programFilters = [{ term: { status: 'published' } }];
        const episodeFilters = [{ term: { status: 'published' } }];
        if (query.language) {
            programFilters.push({ term: { language: query.language } });
        }
        if (query.type) {
            programFilters.push({ term: { type: query.type } });
        }
        if (query.category) {
            programFilters.push({
                nested: {
                    path: 'categories',
                    query: { term: { 'categories.slug': query.category } },
                },
            });
        }
        const { body } = await this.client.msearch({
            body: [
                { index: constants_1.INDEX_NAMES.PROGRAMS },
                {
                    query: {
                        bool: {
                            must: {
                                multi_match: {
                                    query: query.q,
                                    fields: ['title^3', 'description', 'categories.name'],
                                    type: 'best_fields',
                                    fuzziness: 'AUTO',
                                },
                            },
                            filter: programFilters,
                        },
                    },
                    highlight: {
                        fields: {
                            title: { number_of_fragments: 1 },
                            description: { number_of_fragments: 2, fragment_size: 150 },
                        },
                        pre_tags: ['<em>'],
                        post_tags: ['</em>'],
                    },
                    from,
                    size: query.limit,
                },
                { index: constants_1.INDEX_NAMES.EPISODES },
                {
                    query: {
                        bool: {
                            must: {
                                multi_match: {
                                    query: query.q,
                                    fields: ['title^3', 'description', 'programTitle'],
                                    type: 'best_fields',
                                    fuzziness: 'AUTO',
                                },
                            },
                            filter: episodeFilters,
                        },
                    },
                    highlight: {
                        fields: {
                            title: { number_of_fragments: 1 },
                            description: { number_of_fragments: 2, fragment_size: 150 },
                        },
                        pre_tags: ['<em>'],
                        post_tags: ['</em>'],
                    },
                    from,
                    size: query.limit,
                },
            ],
        });
        const responses = body.responses || [];
        const programsResponse = responses.at(0);
        const episodesResponse = responses.at(1);
        const programsTotal = this.extractTotal(programsResponse);
        const episodesTotal = this.extractTotal(episodesResponse);
        const programHits = programsResponse?.hits?.hits || [];
        const episodeHits = episodesResponse?.hits?.hits || [];
        const result = {
            data: {
                programs: programHits.map((hit) => ({
                    id: hit._source.id,
                    title: hit._source.title,
                    description: hit._source.description,
                    type: hit._source.type,
                    thumbnailUrl: hit._source.thumbnailUrl,
                    episodeCount: hit._source.episodeCount,
                    categories: hit._source.categories,
                    highlight: hit.highlight || {},
                })),
                episodes: episodeHits.map((hit) => ({
                    id: hit._source.id,
                    title: hit._source.title,
                    programId: hit._source.programId,
                    programTitle: hit._source.programTitle,
                    durationSeconds: hit._source.durationSeconds,
                    episodeNumber: hit._source.episodeNumber,
                    seasonNumber: hit._source.seasonNumber,
                    publishDate: hit._source.publishDate,
                    highlight: hit.highlight || {},
                })),
            },
            meta: {
                programsTotal,
                episodesTotal,
                page: query.page,
                limit: query.limit,
            },
        };
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.SEARCH);
        return result;
    }
    extractTotal(response) {
        if (!response?.hits?.total)
            return 0;
        const total = response.hits.total;
        return typeof total === 'number' ? total : total.value || 0;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.OPENSEARCH_CLIENT)),
    __metadata("design:paramtypes", [opensearch_1.Client,
        cache_service_1.CacheService])
], SearchService);
//# sourceMappingURL=search.service.js.map