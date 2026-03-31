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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const episodes_service_1 = require("./episodes.service");
const list_episodes_query_dto_1 = require("./dto/list-episodes-query.dto");
let EpisodesController = class EpisodesController {
    constructor(episodesService) {
        this.episodesService = episodesService;
    }
    async findByProgramId(programId, query) {
        return this.episodesService.findByProgramId(programId, query);
    }
    async findById(id) {
        return this.episodesService.findById(id);
    }
};
exports.EpisodesController = EpisodesController;
__decorate([
    (0, common_1.Get)('programs/:programId/episodes'),
    (0, swagger_1.ApiOperation)({
        summary: 'List episodes of a program',
        description: 'Get paginated episodes for a specific program, with optional season filter',
    }),
    (0, swagger_1.ApiParam)({ name: 'programId', description: 'Program UUID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated list of episodes' }),
    __param(0, (0, common_1.Param)('programId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, list_episodes_query_dto_1.ListEpisodesQueryDto]),
    __metadata("design:returntype", Promise)
], EpisodesController.prototype, "findByProgramId", null);
__decorate([
    (0, common_1.Get)('episodes/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get episode detail',
        description: 'Get a single episode with full details including media',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Episode UUID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Episode detail' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Episode not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EpisodesController.prototype, "findById", null);
exports.EpisodesController = EpisodesController = __decorate([
    (0, swagger_1.ApiTags)('episodes'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [episodes_service_1.EpisodesService])
], EpisodesController);
//# sourceMappingURL=episodes.controller.js.map