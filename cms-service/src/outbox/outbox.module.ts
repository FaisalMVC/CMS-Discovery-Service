import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from './entities/outbox.entity';
import { OutboxService } from './outbox.service';
import { OutboxProcessor } from './outbox.processor';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Outbox])],
  providers: [OutboxService, RabbitMQService, OutboxProcessor],
  exports: [OutboxService],
})
export class OutboxModule {}