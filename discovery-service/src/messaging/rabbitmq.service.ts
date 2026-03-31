import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: ChannelModel;
  private channel: Channel;

  private readonly rabbitmqUrl: string;
  private readonly exchangeName: string;
  private readonly queueName: string;

  private messageHandler: ((msg: ConsumeMessage | null) => void) | null = null;

  constructor(private readonly configService: ConfigService) {
    this.rabbitmqUrl = this.configService.get<string>('rabbitmq.url') ?? '';
    this.exchangeName = this.configService.get<string>('rabbitmq.exchange') ?? '';
    this.queueName = this.configService.get<string>('rabbitmq.queue') ?? '';
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error.message);
    }
  }

  async consume(handler: (msg: ConsumeMessage | null) => void): Promise<void> {
    this.messageHandler = handler;
    await this.channel.consume(this.queueName, handler, { noAck: false });
    this.logger.log(`Consuming from queue "${this.queueName}"`);
  }

  private async connectWithRetry(retries = 5, delayMs = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.connection = await connect(this.rabbitmqUrl);
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
        await this.channel.bindQueue(
          `${this.queueName}.dlq`,
          `${this.exchangeName}.dlx`,
          'dead-letter',
        );

        await this.channel.prefetch(10);

        this.logger.log(`Connected to RabbitMQ. Exchange: "${this.exchangeName}", Queue: "${this.queueName}"`);

        this.connection.on('error', (err: { message: any }) => {
          this.logger.error('RabbitMQ connection error', err.message);
        });

        this.connection.on('close', () => {
          this.logger.warn('RabbitMQ connection closed. Attempting reconnect...');
          setTimeout(() => this.connectWithRetry(), delayMs);
        });

        return;
      } catch (error) {
        this.logger.warn(`RabbitMQ connection attempt ${attempt}/${retries} failed: ${error.message}`);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          this.logger.error('Failed to connect to RabbitMQ after all retries');
          throw error;
        }
      }
    }
  }

  getChannel(): Channel {
    return this.channel;
  }
}