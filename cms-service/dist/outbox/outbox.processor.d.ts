import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OutboxService } from './outbox.service';
import { RabbitMQService } from './rabbitmq.service';
export declare class OutboxProcessor implements OnModuleInit, OnModuleDestroy {
    private readonly outboxService;
    private readonly configService;
    private readonly rabbitMQService;
    private readonly logger;
    private intervalRef;
    private readonly pollingInterval;
    private readonly batchSize;
    constructor(outboxService: OutboxService, configService: ConfigService, rabbitMQService: RabbitMQService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private startPolling;
    private stopPolling;
    private processBatch;
}
