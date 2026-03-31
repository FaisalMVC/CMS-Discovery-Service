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
var EventDispatcherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcherService = void 0;
const common_1 = require("@nestjs/common");
const program_event_handler_1 = require("./handlers/program-event.handler");
const episode_event_handler_1 = require("./handlers/episode-event.handler");
const cms_event_dto_1 = require("./dto/cms-event.dto");
const constants_1 = require("../common/constants");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const rabbitmq_service_1 = require("./rabbitmq.service");
let EventDispatcherService = EventDispatcherService_1 = class EventDispatcherService {
    constructor(rabbitMQService, programEventHandler, episodeEventHandler) {
        this.rabbitMQService = rabbitMQService;
        this.programEventHandler = programEventHandler;
        this.episodeEventHandler = episodeEventHandler;
        this.logger = new common_1.Logger(EventDispatcherService_1.name);
    }
    async onApplicationBootstrap() {
        await this.rabbitMQService.consume((msg) => this.handleMessage(msg));
    }
    async handleMessage(msg) {
        if (!msg)
            return;
        const channel = this.rabbitMQService.getChannel();
        let parsed;
        try {
            parsed = JSON.parse(msg.content.toString());
        }
        catch {
            this.logger.warn('Received malformed JSON message, acknowledging to discard');
            channel.ack(msg);
            return;
        }
        const event = (0, class_transformer_1.plainToInstance)(cms_event_dto_1.CmsEventDto, parsed);
        const errors = await (0, class_validator_1.validate)(event);
        if (errors.length > 0) {
            this.logger.warn(`Invalid event structure: ${errors.map((e) => Object.values(e.constraints || {})).flat().join(', ')}`);
            channel.ack(msg);
            return;
        }
        try {
            await this.dispatch(event);
            channel.ack(msg);
        }
        catch (error) {
            this.logger.error(`Failed to process event ${event.eventType} for ${event.aggregateId}: ${error.message}`, error.stack);
            const retryCount = this.getRetryCount(msg);
            if (retryCount >= 3) {
                this.logger.error(`Max retries reached for event ${event.eventType} ${event.aggregateId}. Sending to DLQ.`);
                channel.nack(msg, false, false);
            }
            else {
                this.logger.warn(`Requeuing event ${event.eventType} ${event.aggregateId} (retry ${retryCount + 1}/3)`);
                channel.nack(msg, false, true);
            }
        }
    }
    async dispatch(event) {
        const { aggregateType, eventType, payload } = event;
        switch (aggregateType) {
            case constants_1.AGGREGATE_TYPES.PROGRAM:
                await this.programEventHandler.handle(eventType, payload);
                break;
            case constants_1.AGGREGATE_TYPES.EPISODE:
                await this.episodeEventHandler.handle(eventType, payload);
                break;
            default:
                this.logger.warn(`Unknown aggregate type: ${aggregateType}, skipping`);
        }
    }
    getRetryCount(msg) {
        const deaths = msg.properties?.headers?.['x-death'];
        if (Array.isArray(deaths) && deaths.length > 0) {
            return deaths.length;
        }
        return 0;
    }
};
exports.EventDispatcherService = EventDispatcherService;
exports.EventDispatcherService = EventDispatcherService = EventDispatcherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_service_1.RabbitMQService,
        program_event_handler_1.ProgramEventHandler,
        episode_event_handler_1.EpisodeEventHandler])
], EventDispatcherService);
//# sourceMappingURL=event-dispatcher.service.js.map