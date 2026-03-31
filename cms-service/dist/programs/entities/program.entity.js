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
exports.Program = void 0;
const typeorm_1 = require("typeorm");
const program_type_enum_1 = require("../../common/enums/program-type.enum");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const category_entity_1 = require("../../categories/entities/category.entity");
const episode_entity_1 = require("../../episodes/entities/episode.entity");
let Program = class Program {
};
exports.Program = Program;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Program.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Program.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: program_type_enum_1.ProgramType }),
    __metadata("design:type", String)
], Program.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ar' }),
    __metadata("design:type", String)
], Program.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: content_status_enum_1.ContentStatus,
        default: content_status_enum_1.ContentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Program.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'manual' }),
    __metadata("design:type", String)
], Program.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_id', nullable: true }),
    __metadata("design:type", String)
], Program.prototype, "sourceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Program.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Program.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.programs, {
        cascade: true,
    }),
    (0, typeorm_1.JoinTable)({
        name: 'program_categories',
        joinColumn: { name: 'program_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Program.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => episode_entity_1.Episode, (episode) => episode.program, { cascade: true }),
    __metadata("design:type", Array)
], Program.prototype, "episodes", void 0);
exports.Program = Program = __decorate([
    (0, typeorm_1.Entity)('programs'),
    (0, typeorm_1.Unique)(['source', 'sourceId'])
], Program);
//# sourceMappingURL=program.entity.js.map