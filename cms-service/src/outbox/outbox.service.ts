import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Outbox } from './entities/outbox.entity';
import { EventType } from '../common/enums/event-type.enum';
import { OutboxStatus } from '../common/enums/outbox-status.enum';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    @InjectRepository(Outbox)
    private readonly outboxRepository: Repository<Outbox>,
  ) {}
  async createEntry(
    manager: EntityManager,
    aggregateType: string,
    aggregateId: string,
    eventType: EventType,
    payload: Record<string, any>,
  ): Promise<Outbox> {
    const outboxEntry = manager.create(Outbox, {
      aggregateType,
      aggregateId,
      eventType,
      payload,
      status: OutboxStatus.PENDING,
    });

    return manager.save(Outbox, outboxEntry);
  }
  async fetchPendingBatch(batchSize: number): Promise<Outbox[]> {
    return this.outboxRepository.find({
      where: { status: OutboxStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: batchSize,
    });
  }
  async markAsSent(id: string): Promise<void> {
    await this.outboxRepository.update(id, {
      status: OutboxStatus.SENT,
      processedAt: new Date(),
    });
  }
  async markAsFailed(id: string): Promise<void> {
    await this.outboxRepository.update(id, {
      status: OutboxStatus.FAILED,
      processedAt: new Date(),
    });
  }
}
