import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { ProgramEventHandler } from './handlers/program-event.handler';
import { EpisodeEventHandler } from './handlers/episode-event.handler';
import { CmsEventDto } from './dto/cms-event.dto';
import { AGGREGATE_TYPES } from '../common/constants';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class EventDispatcherService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventDispatcherService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly programEventHandler: ProgramEventHandler,
    private readonly episodeEventHandler: EpisodeEventHandler,
  ) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.rabbitMQService.consume((msg) => this.handleMessage(msg));
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) return;

    const channel = this.rabbitMQService.getChannel();
    let parsed: any;

    try {
      parsed = JSON.parse(msg.content.toString());
    } catch {
      this.logger.warn('Received malformed JSON message, acknowledging to discard');
      channel.ack(msg);
      return;
    }

    const event = plainToInstance(CmsEventDto, parsed);
    const errors = await validate(event);

    if (errors.length > 0) {
      this.logger.warn(
        `Invalid event structure: ${errors.map((e) => Object.values(e.constraints || {})).flat().join(', ')}`,
      );
      channel.ack(msg);
      return;
    }

    try {
      await this.dispatch(event);
      channel.ack(msg);
    } catch (error) {
      this.logger.error(
        `Failed to process event ${event.eventType} for ${event.aggregateId}: ${error.message}`,
        error.stack,
      );

      const retryCount = this.getRetryCount(msg);

      if (retryCount >= 3) {
        this.logger.error(
          `Max retries reached for event ${event.eventType} ${event.aggregateId}. Sending to DLQ.`,
        );
        channel.nack(msg, false, false);
      } else {
        this.logger.warn(
          `Requeuing event ${event.eventType} ${event.aggregateId} (retry ${retryCount + 1}/3)`,
        );
        channel.nack(msg, false, true);
      }
    }
  }

  private async dispatch(event: CmsEventDto): Promise<void> {
    const { aggregateType, eventType, payload } = event;

    switch (aggregateType) {
      case AGGREGATE_TYPES.PROGRAM:
        await this.programEventHandler.handle(eventType, payload as any);
        break;

      case AGGREGATE_TYPES.EPISODE:
        await this.episodeEventHandler.handle(eventType, payload as any);
        break;

      default:
        this.logger.warn(`Unknown aggregate type: ${aggregateType}, skipping`);
    }
  }

  private getRetryCount(msg: ConsumeMessage): number {
    const deaths = msg.properties?.headers?.['x-death'];
    if (Array.isArray(deaths) && deaths.length > 0) {
      return deaths.length;
    }
    return 0;
  }
}