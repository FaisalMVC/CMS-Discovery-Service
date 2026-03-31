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
exports.Outbox = void 0;
const typeorm_1 = require("typeorm");
const event_type_enum_1 = require("../../common/enums/event-type.enum");
const outbox_status_enum_1 = require("../../common/enums/outbox-status.enum");
let Outbox = class Outbox {
};
exports.Outbox = Outbox;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Outbox.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aggregate_type' }),
    __metadata("design:type", String)
], Outbox.prototype, "aggregateType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aggregate_id', type: 'uuid' }),
    __metadata("design:type", String)
], Outbox.prototype, "aggregateId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'event_type',
        type: 'enum',
        enum: event_type_enum_1.EventType,
    }),
    __metadata("design:type", String)
], Outbox.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Outbox.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: outbox_status_enum_1.OutboxStatus,
        default: outbox_status_enum_1.OutboxStatus.PENDING,
    }),
    __metadata("design:type", String)
], Outbox.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Outbox.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Outbox.prototype, "processedAt", void 0);
exports.Outbox = Outbox = __decorate([
    (0, typeorm_1.Entity)('outbox')
], Outbox);
//# sourceMappingURL=outbox.entity.js.map