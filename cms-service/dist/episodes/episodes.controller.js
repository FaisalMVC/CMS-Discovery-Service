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
const create_episode_dto_1 = require("./dto/create-episode.dto");
const update_episode_dto_1 = require("./dto/update-episode.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let EpisodesController = class EpisodesController {
    constructor(episodesService) {
        this.episodesService = episodesService;
    }
    create(programId, dto) {
        return this.episodesService.create(programId, dto);
    }
    findAllByProgram(programId, query) {
        return this.episodesService.findAllByProgram(programId, query);
    }
    findOne(id) {
        return this.episodesService.findOne(id);
    }
    update(id, dto) {
        return this.episodesService.update(id, dto);
    }
    remove(id) {
        return this.episodesService.remove(id);
    }
};
exports.EpisodesController = EpisodesController;
__decorate([
    (0, common_1.Post)('programs/:programId/episodes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Create an episode for a program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Episode created' }),
    __param(0, (0, common_1.Param)('programId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_episode_dto_1.CreateEpisodeDto]),
    __metadata("design:returntype", void 0)
], EpisodesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('programs/:programId/episodes'),
    (0, swagger_1.ApiOperation)({ summary: 'List all episodes for a program (paginated)' }),
    __param(0, (0, common_1.Param)('programId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], EpisodesController.prototype, "findAllByProgram", null);
__decorate([
    (0, common_1.Get)('episodes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an episode by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Episode not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EpisodesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('episodes/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Update an episode' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_episode_dto_1.UpdateEpisodeDto]),
    __metadata("design:returntype", void 0)
], EpisodesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('episodes/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an episode' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EpisodesController.prototype, "remove", null);
exports.EpisodesController = EpisodesController = __decorate([
    (0, swagger_1.ApiTags)('Episodes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [episodes_service_1.EpisodesService])
], EpisodesController);
//# sourceMappingURL=episodes.controller.js.map