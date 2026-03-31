import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { EventDispatcherService } from './event-dispatcher.service';
import { ProgramEventHandler } from './handlers/program-event.handler';
import { EpisodeEventHandler } from './handlers/episode-event.handler';
import { ProgramsModule } from '../programs/programs.module';
import { EpisodesModule } from '../episodes/episodes.module';
import rabbitmqConfig from '../config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
    ProgramsModule,
    EpisodesModule,
  ],
  providers: [
    RabbitMQService,         
    EventDispatcherService,  
    ProgramEventHandler,
    EpisodeEventHandler,
  ],
})
export class MessagingModule {}