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
var EpisodesRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesRepository = void 0;
const common_1 = require("@nestjs/common");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
let EpisodesRepository = EpisodesRepository_1 = class EpisodesRepository {
    constructor(client) {
        this.client = client;
        this.logger = new common_1.Logger(EpisodesRepository_1.name);
        this.index = constants_1.INDEX_NAMES.EPISODES;
    }
    async upsert(id, document) {
        await this.client.index({
            index: this.index,
            id,
            body: document,
            refresh: 'wait_for',
        });
    }
    async delete(id) {
        try {
            await this.client.delete({
                index: this.index,
                id,
                refresh: 'wait_for',
            });
        }
        catch (error) {
            if (error.meta?.statusCode === 404) {
                this.logger.warn(`Episode ${id} not found for deletion`);
                return;
            }
            throw error;
        }
    }
    async deleteByProgramId(programId) {
        await this.client.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    term: { programId },
                },
            },
            refresh: true,
        });
        this.logger.log(`Deleted all episodes for program ${programId}`);
    }
    async findById(id) {
        try {
            const { body } = await this.client.get({
                index: this.index,
                id,
            });
            return body._source;
        }
        catch (error) {
            if (error.meta?.statusCode === 404)
                return null;
            throw error;
        }
    }
    async countByProgramId(programId) {
        try {
            const { body } = await this.client.count({
                index: this.index,
                body: {
                    query: {
                        bool: {
                            filter: [
                                { term: { programId } },
                                { term: { status: 'published' } },
                            ],
                        },
                    },
                },
            });
            return body.count;
        }
        catch (error) {
            this.logger.warn(`Failed to count episodes for program ${programId}: ${error.message}`);
            return 0;
        }
    }
    async search(params) {
        const { programId, status, season, page, limit, sortBy, sortOrder } = params;
        const from = (page - 1) * limit;
        const filter = [];
        if (programId) {
            filter.push({ term: { programId } });
        }
        if (status) {
            filter.push({ term: { status } });
        }
        if (season !== undefined && season !== null) {
            filter.push({ term: { seasonNumber: season } });
        }
        const sort = [];
        if (sortBy === 'publishDate') {
            sort.push({ publishDate: { order: sortOrder } });
        }
        else if (sortBy === 'createdAt') {
            sort.push({ createdAt: { order: sortOrder } });
        }
        else {
            sort.push({ episodeNumber: { order: sortOrder } });
        }
        const query = {
            bool: {
                filter,
            },
        };
        if (filter.length === 0) {
            query.bool.must = [{ match_all: {} }];
        }
        const { body } = await this.client.search({
            index: this.index,
            body: {
                query,
                sort,
                from,
                size: limit,
            },
        });
        const total = typeof body.hits.total === 'number'
            ? body.hits.total
            : body.hits.total.value;
        return {
            hits: body.hits.hits.map((hit) => hit._source),
            total,
        };
    }
};
exports.EpisodesRepository = EpisodesRepository;
exports.EpisodesRepository = EpisodesRepository = EpisodesRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.OPENSEARCH_CLIENT)),
    __metadata("design:paramtypes", [opensearch_1.Client])
], EpisodesRepository);
//# sourceMappingURL=episodes.repository.js.map