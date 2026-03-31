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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEpisodesQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_query_dto_1 = require("../../common/dto/pagination-query.dto");
class ListEpisodesQueryDto extends pagination_query_dto_1.PaginationQueryDto {
    constructor() {
        super(...arguments);
        this.status = 'published';
        this.sortBy = 'episodeNumber';
        this.sortOrder = 'asc';
    }
}
exports.ListEpisodesQueryDto = ListEpisodesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by season number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ListEpisodesQueryDto.prototype, "season", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status', default: 'published' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListEpisodesQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        enum: ['episodeNumber', 'publishDate', 'createdAt'],
        default: 'episodeNumber',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['episodeNumber', 'publishDate', 'createdAt']),
    __metadata("design:type", String)
], ListEpisodesQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'asc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], ListEpisodesQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=list-episodes-query.dto.js.map