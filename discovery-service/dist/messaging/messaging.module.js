"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rabbitmq_service_1 = require("./rabbitmq.service");
const event_dispatcher_service_1 = require("./event-dispatcher.service");
const program_event_handler_1 = require("./handlers/program-event.handler");
const episode_event_handler_1 = require("./handlers/episode-event.handler");
const programs_module_1 = require("../programs/programs.module");
const episodes_module_1 = require("../episodes/episodes.module");
const rabbitmq_config_1 = require("../config/rabbitmq.config");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(rabbitmq_config_1.default),
            programs_module_1.ProgramsModule,
            episodes_module_1.EpisodesModule,
        ],
        providers: [
            rabbitmq_service_1.RabbitMQService,
            event_dispatcher_service_1.EventDispatcherService,
            program_event_handler_1.ProgramEventHandler,
            episode_event_handler_1.EpisodeEventHandler,
        ],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map