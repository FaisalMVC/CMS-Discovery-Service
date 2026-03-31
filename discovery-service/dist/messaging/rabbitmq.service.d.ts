import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ConsumeMessage } from 'amqplib';
export declare class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private connection;
    private channel;
    private readonly rabbitmqUrl;
    private readonly exchangeName;
    private readonly queueName;
    private messageHandler;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    consume(handler: (msg: ConsumeMessage | null) => void): Promise<void>;
    private connectWithRetry;
    getChannel(): Channel;
}
