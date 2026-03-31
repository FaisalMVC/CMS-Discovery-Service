"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('rabbitmq', () => ({
    url: process.env.RABBITMQ_URL || 'amqp://rabbit_user:rabbit_password@localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'cms.events',
    queue: process.env.RABBITMQ_QUEUE || 'discovery.content.sync',
}));
//# sourceMappingURL=rabbitmq.config.js.map