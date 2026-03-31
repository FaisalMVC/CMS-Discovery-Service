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
var RabbitMQService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqplib_1 = require("amqplib");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
        this.messageHandler = null;
        this.rabbitmqUrl = this.configService.get('rabbitmq.url') ?? '';
        this.exchangeName = this.configService.get('rabbitmq.exchange') ?? '';
        this.queueName = this.configService.get('rabbitmq.queue') ?? '';
    }
    async onModuleInit() {
        await this.connectWithRetry();
    }
    async onModuleDestroy() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            this.logger.log('RabbitMQ connection closed');
        }
        catch (error) {
            this.logger.error('Error closing RabbitMQ connection', error.message);
        }
    }
    async consume(handler) {
        this.messageHandler = handler;
        await this.channel.consume(this.queueName, handler, { noAck: false });
        this.logger.log(`Consuming from queue "${this.queueName}"`);
    }
    async connectWithRetry(retries = 5, delayMs = 5000) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                this.connection = await (0, amqplib_1.connect)(this.rabbitmqUrl);
                this.channel = await this.connection.createChannel();
                await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
                await this.channel.assertQueue(this.queueName, {
                    durable: true,
                    arguments: {
                        'x-dead-letter-exchange': `${this.exchangeName}.dlx`,
                        'x-dead-letter-routing-key': 'dead-letter',
                    },
                });
                await this.channel.bindQueue(this.queueName, this.exchangeName, 'program.*');
                await this.channel.bindQueue(this.queueName, this.exchangeName, 'episode.*');
                await this.channel.assertExchange(`${this.exchangeName}.dlx`, 'direct', { durable: true });
                await this.channel.assertQueue(`${this.queueName}.dlq`, { durable: true });
                await this.channel.bindQueue(`${this.queueName}.dlq`, `${this.exchangeName}.dlx`, 'dead-letter');
                await this.channel.prefetch(10);
                this.logger.log(`Connected to RabbitMQ. Exchange: "${this.exchangeName}", Queue: "${this.queueName}"`);
                this.connection.on('error', (err) => {
                    this.logger.error('RabbitMQ connection error', err.message);
                });
                this.connection.on('close', () => {
                    this.logger.warn('RabbitMQ connection closed. Attempting reconnect...');
                    setTimeout(() => this.connectWithRetry(), delayMs);
                });
                return;
            }
            catch (error) {
                this.logger.warn(`RabbitMQ connection attempt ${attempt}/${retries} failed: ${error.message}`);
                if (attempt < retries) {
                    await new Promise((resolve) => setTimeout(resolve, delayMs));
                }
                else {
                    this.logger.error('Failed to connect to RabbitMQ after all retries');
                    throw error;
                }
            }
        }
    }
    getChannel() {
        return this.channel;
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map