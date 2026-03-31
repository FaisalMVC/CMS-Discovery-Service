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
exports.ImportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
class ImportDto {
}
exports.ImportDto = ImportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'apple_podcasts',
        description: 'The source to import from (e.g. apple_podcasts)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { podcastId: '1234567890' },
        description: 'Config specific to the source strategy',
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ImportDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: content_status_enum_1.ContentStatus,
        example: content_status_enum_1.ContentStatus.DRAFT,
        description: 'Status to assign to the imported program and episodes (default: draft)',
    }),
    (0, class_validator_1.IsEnum)(content_status_enum_1.ContentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Category UUIDs to assign to the imported program',
        example: ['uuid-1'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ImportDto.prototype, "categoryIds", void 0);
//# sourceMappingURL=import.dto.js.map