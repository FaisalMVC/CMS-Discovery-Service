import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://rabbit_user:rabbit_password@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'cms.events',
  queue: process.env.RABBITMQ_QUEUE || 'discovery.content.sync',
}));
