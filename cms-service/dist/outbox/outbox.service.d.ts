import { Repository, EntityManager } from 'typeorm';
import { Outbox } from './entities/outbox.entity';
import { EventType } from '../common/enums/event-type.enum';
export declare class OutboxService {
    private readonly outboxRepository;
    private readonly logger;
    constructor(outboxRepository: Repository<Outbox>);
    createEntry(manager: EntityManager, aggregateType: string, aggregateId: string, eventType: EventType, payload: Record<string, any>): Promise<Outbox>;
    fetchPendingBatch(batchSize: number): Promise<Outbox[]>;
    markAsSent(id: string): Promise<void>;
    markAsFailed(id: string): Promise<void>;
}
