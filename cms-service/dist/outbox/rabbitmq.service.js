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
const amqplib = require("amqplib");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
        this.connection = null;
        this.channel = null;
        this.exchangeName = 'cms.events';
        this.rabbitmqUrl = this.configService.get('rabbitmq.url') ?? '';
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async connect() {
        try {
            this.connection = await amqplib.connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'topic', {
                durable: true,
            });
            this.logger.log('Connected to RabbitMQ');
            this.connection.on('error', (err) => {
                this.logger.error('RabbitMQ connection error', err.message);
            });
            this.connection.on('close', () => {
                this.logger.warn('RabbitMQ connection closed. Reconnecting in 5s...');
                setTimeout(() => this.connect(), 5000);
            });
        }
        catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error.message);
            setTimeout(() => this.connect(), 5000);
        }
    }
    async disconnect() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            this.logger.log('Disconnected from RabbitMQ');
        }
        catch (error) {
            this.logger.error('Error disconnecting from RabbitMQ', error.message);
        }
    }
    getChannel() {
        return this.channel;
    }
    getExchangeName() {
        return this.exchangeName;
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map