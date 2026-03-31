import { EventType } from '../../common/enums/event-type.enum';
import { OutboxStatus } from '../../common/enums/outbox-status.enum';
export declare class Outbox {
    id: string;
    aggregateType: string;
    aggregateId: string;
    eventType: EventType;
    payload: Record<string, any>;
    status: OutboxStatus;
    createdAt: Date;
    processedAt: Date | null;
}
