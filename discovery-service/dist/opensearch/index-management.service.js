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
var IndexManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexManagementService = void 0;
const common_1 = require("@nestjs/common");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
let IndexManagementService = IndexManagementService_1 = class IndexManagementService {
    constructor(client) {
        this.client = client;
        this.logger = new common_1.Logger(IndexManagementService_1.name);
    }
    async onModuleInit() {
        await this.ensureIndices();
    }
    async ensureIndices() {
        await this.createIndexIfNotExists(constants_1.INDEX_NAMES.PROGRAMS, this.getProgramsMapping());
        await this.createIndexIfNotExists(constants_1.INDEX_NAMES.EPISODES, this.getEpisodesMapping());
    }
    async createIndexIfNotExists(indexName, body) {
        try {
            const { body: exists } = await this.client.indices.exists({ index: indexName });
            if (!exists) {
                await this.client.indices.create({ index: indexName, body });
                this.logger.log(`Index "${indexName}" created successfully`);
            }
            else {
                this.logger.log(`Index "${indexName}" already exists`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to create index "${indexName}": ${error.message}`);
            throw error;
        }
    }
    getAnalysisSettings() {
        return {
            analysis: {
                analyzer: {
                    arabic_english: {
                        type: 'custom',
                        tokenizer: 'standard',
                        filter: [
                            'lowercase',
                            'arabic_normalization',
                            'arabic_stemmer',
                            'english_stemmer',
                        ],
                    },
                },
                filter: {
                    arabic_stemmer: { type: 'stemmer', language: 'arabic' },
                    english_stemmer: { type: 'stemmer', language: 'english' },
                },
            },
        };
    }
    getProgramsMapping() {
        return {
            settings: {
                number_of_shards: 2,
                number_of_replicas: 1,
                ...this.getAnalysisSettings(),
            },
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    title: { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
                    description: { type: 'text', analyzer: 'arabic_english' },
                    type: { type: 'keyword' },
                    language: { type: 'keyword' },
                    thumbnailUrl: { type: 'keyword', index: false },
                    status: { type: 'keyword' },
                    source: { type: 'keyword' },
                    sourceId: { type: 'keyword' },
                    categories: {
                        type: 'nested',
                        properties: {
                            id: { type: 'keyword' },
                            name: { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
                            slug: { type: 'keyword' },
                        },
                    },
                    episodeCount: { type: 'integer' },
                    createdAt: { type: 'date' },
                    updatedAt: { type: 'date' },
                },
            },
        };
    }
    getEpisodesMapping() {
        return {
            settings: {
                number_of_shards: 3,
                number_of_replicas: 1,
                ...this.getAnalysisSettings(),
            },
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    programId: { type: 'keyword' },
                    programTitle: { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
                    title: { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
                    description: { type: 'text', analyzer: 'arabic_english' },
                    episodeNumber: { type: 'integer' },
                    seasonNumber: { type: 'integer' },
                    durationSeconds: { type: 'integer' },
                    publishDate: { type: 'date' },
                    status: { type: 'keyword' },
                    source: { type: 'keyword' },
                    sourceId: { type: 'keyword' },
                    media: {
                        type: 'nested',
                        properties: {
                            id: { type: 'keyword' },
                            type: { type: 'keyword' },
                            url: { type: 'keyword', index: false },
                            mimeType: { type: 'keyword' },
                        },
                    },
                    createdAt: { type: 'date' },
                    updatedAt: { type: 'date' },
                },
            },
        };
    }
};
exports.IndexManagementService = IndexManagementService;
exports.IndexManagementService = IndexManagementService = IndexManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.OPENSEARCH_CLIENT)),
    __metadata("design:paramtypes", [opensearch_1.Client])
], IndexManagementService);
//# sourceMappingURL=index-management.service.js.map