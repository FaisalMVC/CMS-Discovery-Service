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
var OutboxProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxProcessor = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const outbox_service_1 = require("./outbox.service");
const rabbitmq_service_1 = require("./rabbitmq.service");
let OutboxProcessor = OutboxProcessor_1 = class OutboxProcessor {
    constructor(outboxService, configService, rabbitMQService) {
        this.outboxService = outboxService;
        this.configService = configService;
        this.rabbitMQService = rabbitMQService;
        this.logger = new common_1.Logger(OutboxProcessor_1.name);
        this.intervalRef = null;
        this.pollingInterval = this.configService.get('outbox.pollingInterval') ?? 5000;
        this.batchSize = this.configService.get('outbox.batchSize') ?? 50;
    }
    async onModuleInit() {
        this.startPolling();
    }
    async onModuleDestroy() {
        this.stopPolling();
    }
    startPolling() {
        this.logger.log(`Outbox poller started — interval: ${this.pollingInterval}ms, batch: ${this.batchSize}`);
        this.intervalRef = setInterval(async () => {
            await this.processBatch();
        }, this.pollingInterval);
    }
    stopPolling() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
            this.intervalRef = null;
            this.logger.log('Outbox poller stopped');
        }
    }
    async processBatch() {
        const channel = this.rabbitMQService.getChannel();
        if (!channel) {
            this.logger.warn('RabbitMQ channel not available, skipping batch');
            return;
        }
        try {
            const entries = await this.outboxService.fetchPendingBatch(this.batchSize);
            if (entries.length === 0)
                return;
            this.logger.log(`Processing ${entries.length} outbox entries`);
            for (const entry of entries) {
                try {
                    const routingKey = `${entry.aggregateType}.${entry.eventType}`;
                    const message = {
                        eventType: `${entry.aggregateType.toUpperCase()}_${entry.eventType.toUpperCase()}`,
                        aggregateType: entry.aggregateType,
                        aggregateId: entry.aggregateId,
                        payload: entry.payload,
                        timestamp: entry.createdAt.toISOString(),
                    };
                    channel.publish(this.rabbitMQService.getExchangeName(), routingKey, Buffer.from(JSON.stringify(message)), { persistent: true, contentType: 'application/json' });
                    await this.outboxService.markAsSent(entry.id);
                }
                catch (error) {
                    this.logger.error(`Failed to process outbox entry ${entry.id}`, error.message);
                    await this.outboxService.markAsFailed(entry.id);
                }
            }
        }
        catch (error) {
            this.logger.error('Failed to process outbox batch', error.message);
        }
    }
};
exports.OutboxProcessor = OutboxProcessor;
exports.OutboxProcessor = OutboxProcessor = OutboxProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outbox_service_1.OutboxService,
        config_1.ConfigService,
        rabbitmq_service_1.RabbitMQService])
], OutboxProcessor);
//# sourceMappingURL=outbox.processor.js.map