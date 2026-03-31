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
exports.SearchMeta = exports.SearchResponseDto = exports.EpisodeSearchHit = exports.ProgramSearchHit = exports.SearchHighlight = void 0;
const swagger_1 = require("@nestjs/swagger");
class SearchHighlight {
}
exports.SearchHighlight = SearchHighlight;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], SearchHighlight.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], SearchHighlight.prototype, "description", void 0);
class ProgramSearchHit {
}
exports.ProgramSearchHit = ProgramSearchHit;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProgramSearchHit.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProgramSearchHit.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProgramSearchHit.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProgramSearchHit.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ProgramSearchHit.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProgramSearchHit.prototype, "episodeCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SearchHighlight)
], ProgramSearchHit.prototype, "highlight", void 0);
class EpisodeSearchHit {
}
exports.EpisodeSearchHit = EpisodeSearchHit;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EpisodeSearchHit.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EpisodeSearchHit.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EpisodeSearchHit.prototype, "programId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], EpisodeSearchHit.prototype, "programTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EpisodeSearchHit.prototype, "durationSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EpisodeSearchHit.prototype, "episodeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EpisodeSearchHit.prototype, "seasonNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SearchHighlight)
], EpisodeSearchHit.prototype, "highlight", void 0);
class SearchResponseDto {
}
exports.SearchResponseDto = SearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProgramSearchHit] }),
    __metadata("design:type", Array)
], SearchResponseDto.prototype, "programs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EpisodeSearchHit] }),
    __metadata("design:type", Array)
], SearchResponseDto.prototype, "episodes", void 0);
class SearchMeta {
}
exports.SearchMeta = SearchMeta;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchMeta.prototype, "programsTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchMeta.prototype, "episodesTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchMeta.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchMeta.prototype, "limit", void 0);
//# sourceMappingURL=search-response.dto.js.map