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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
const cache_service_1 = require("../cache/cache.service");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    constructor(client, cacheService) {
        this.client = client;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(CategoriesService_1.name);
    }
    async findAll() {
        const cacheKey = `${constants_1.CACHE_PREFIXES.CATEGORIES}:all`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const { body } = await this.client.search({
            index: constants_1.INDEX_NAMES.PROGRAMS,
            body: {
                size: 0,
                query: {
                    term: { status: 'published' },
                },
                aggs: {
                    categories: {
                        nested: {
                            path: 'categories',
                        },
                        aggs: {
                            unique_categories: {
                                terms: {
                                    field: 'categories.slug',
                                    size: 100,
                                },
                                aggs: {
                                    category_name: {
                                        terms: {
                                            field: 'categories.name.keyword',
                                            size: 1,
                                        },
                                    },
                                    category_id: {
                                        terms: {
                                            field: 'categories.id',
                                            size: 1,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const buckets = body.aggregations?.categories?.unique_categories?.buckets || [];
        const categories = buckets.map((bucket) => {
            const nameBuckets = bucket.category_name?.buckets ?? [];
            const idBuckets = bucket.category_id?.buckets ?? [];
            const firstNameBucket = nameBuckets.at(0);
            const firstIdBucket = idBuckets.at(0);
            return {
                slug: bucket.key,
                name: firstNameBucket ? firstNameBucket.key : bucket.key,
                id: firstIdBucket ? firstIdBucket.key : null,
                programCount: bucket.doc_count,
            };
        });
        const result = { data: categories };
        await this.cacheService.set(cacheKey, result, constants_1.CACHE_TTL.CATEGORIES);
        return result;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.OPENSEARCH_CLIENT)),
    __metadata("design:paramtypes", [opensearch_1.Client,
        cache_service_1.CacheService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map