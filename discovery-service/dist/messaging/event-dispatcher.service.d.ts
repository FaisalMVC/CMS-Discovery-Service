import { OnApplicationBootstrap } from '@nestjs/common';
import { ProgramEventHandler } from './handlers/program-event.handler';
import { EpisodeEventHandler } from './handlers/episode-event.handler';
import { RabbitMQService } from './rabbitmq.service';
export declare class EventDispatcherService implements OnApplicationBootstrap {
    private readonly rabbitMQService;
    private readonly programEventHandler;
    private readonly episodeEventHandler;
    private readonly logger;
    constructor(rabbitMQService: RabbitMQService, programEventHandler: ProgramEventHandler, episodeEventHandler: EpisodeEventHandler);
    onApplicationBootstrap(): Promise<void>;
    private handleMessage;
    private dispatch;
    private getRetryCount;
}
