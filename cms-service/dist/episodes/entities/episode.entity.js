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
exports.Episode = void 0;
const typeorm_1 = require("typeorm");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const program_entity_1 = require("../../programs/entities/program.entity");
const media_entity_1 = require("../../media/entities/media.entity");
let Episode = class Episode {
};
exports.Episode = Episode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Episode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Episode.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'episode_number', nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "episodeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'season_number', nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "seasonNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', default: 0 }),
    __metadata("design:type", Number)
], Episode.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'publish_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Episode.prototype, "publishDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: content_status_enum_1.ContentStatus,
        default: content_status_enum_1.ContentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Episode.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'manual' }),
    __metadata("design:type", String)
], Episode.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_id', nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "sourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'program_id' }),
    __metadata("design:type", String)
], Episode.prototype, "programId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Episode.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Episode.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => program_entity_1.Program, (program) => program.episodes, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'program_id' }),
    __metadata("design:type", program_entity_1.Program)
], Episode.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.Media, (media) => media.episode, { cascade: true }),
    __metadata("design:type", Array)
], Episode.prototype, "media", void 0);
exports.Episode = Episode = __decorate([
    (0, typeorm_1.Entity)('episodes'),
    (0, typeorm_1.Unique)(['source', 'sourceId'])
], Episode);
//# sourceMappingURL=episode.entity.js.map