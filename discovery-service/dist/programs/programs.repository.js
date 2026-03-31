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
var ProgramsRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsRepository = void 0;
const common_1 = require("@nestjs/common");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
let ProgramsRepository = ProgramsRepository_1 = class ProgramsRepository {
    constructor(client) {
        this.client = client;
        this.logger = new common_1.Logger(ProgramsRepository_1.name);
        this.index = constants_1.INDEX_NAMES.PROGRAMS;
    }
    async upsert(id, document) {
        await this.client.index({
            index: this.index,
            id,
            body: document,
            refresh: 'wait_for',
        });
    }
    async updatePartial(id, partialDoc) {
        try {
            await this.client.update({
                index: this.index,
                id,
                body: { doc: partialDoc },
                refresh: 'wait_for',
            });
        }
        catch (error) {
            if (error.meta?.statusCode === 404) {
                this.logger.warn(`Program ${id} not found for partial update`);
                return;
            }
            throw error;
        }
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
                this.logger.warn(`Program ${id} not found for deletion`);
                return;
            }
            throw error;
        }
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
    async search(params) {
        const { page, limit, category, language, type, status, sortBy, sortOrder } = params;
        const from = (page - 1) * limit;
        const must = [];
        const filter = [];
        if (status) {
            filter.push({ term: { status } });
        }
        if (language) {
            filter.push({ term: { language } });
        }
        if (type) {
            filter.push({ term: { type } });
        }
        if (category) {
            must.push({
                nested: {
                    path: 'categories',
                    query: {
                        term: { 'categories.slug': category },
                    },
                },
            });
        }
        const sort = [];
        if (sortBy === 'title') {
            sort.push({ 'title.keyword': { order: sortOrder } });
        }
        else if (sortBy === 'episodeCount') {
            sort.push({ episodeCount: { order: sortOrder } });
        }
        else {
            sort.push({ createdAt: { order: sortOrder } });
        }
        const query = {
            bool: {
                must: must.length > 0 ? must : [{ match_all: {} }],
                filter,
            },
        };
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
exports.ProgramsRepository = ProgramsRepository;
exports.ProgramsRepository = ProgramsRepository = ProgramsRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.OPENSEARCH_CLIENT)),
    __metadata("design:paramtypes", [opensearch_1.Client])
], ProgramsRepository);
//# sourceMappingURL=programs.repository.js.map