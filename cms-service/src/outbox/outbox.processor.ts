import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OutboxService } from './outbox.service';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class OutboxProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxProcessor.name);
  private intervalRef: NodeJS.Timeout | null = null;

  private readonly pollingInterval: number;
  private readonly batchSize: number;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly configService: ConfigService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
    this.pollingInterval = this.configService.get<number>('outbox.pollingInterval') ?? 5000;
    this.batchSize = this.configService.get<number>('outbox.batchSize') ?? 50;
  }

  async onModuleInit(): Promise<void> {
    this.startPolling();
  }

  async onModuleDestroy(): Promise<void> {
    this.stopPolling();
  }

  private startPolling(): void {
    this.logger.log(
      `Outbox poller started — interval: ${this.pollingInterval}ms, batch: ${this.batchSize}`,
    );

    this.intervalRef = setInterval(async () => {
      await this.processBatch();
    }, this.pollingInterval);
  }

  private stopPolling(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
      this.logger.log('Outbox poller stopped');
    }
  }

  private async processBatch(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    if (!channel) {
      this.logger.warn('RabbitMQ channel not available, skipping batch');
      return;
    }

    try {
      const entries = await this.outboxService.fetchPendingBatch(this.batchSize);

      if (entries.length === 0) return;

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

          channel.publish(
            this.rabbitMQService.getExchangeName(),
            routingKey,
            Buffer.from(JSON.stringify(message)),
            { persistent: true, contentType: 'application/json' },
          );

          await this.outboxService.markAsSent(entry.id);
        } catch (error) {
          this.logger.error(`Failed to process outbox entry ${entry.id}`, error.message);
          await this.outboxService.markAsFailed(entry.id);
        }
      }
    } catch (error) {
      this.logger.error('Failed to process outbox batch', error.message);
    }
  }
}