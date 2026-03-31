"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'cms_user',
        password: process.env.DB_PASSWORD || 'cms_password',
        name: process.env.DB_NAME || 'cms_db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiration: process.env.JWT_EXPIRATION || '24h',
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    },
    minio: {
        endpoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: parseInt(process.env.MINIO_PORT || '9000', 10),
        accessKey: process.env.MINIO_ACCESS_KEY || 'minio_user',
        secretKey: process.env.MINIO_SECRET_KEY || 'minio_password',
        bucket: process.env.MINIO_BUCKET || 'cms-media',
        useSSL: process.env.MINIO_USE_SSL === 'true',
    },
    outbox: {
        pollingInterval: parseInt(process.env.OUTBOX_POLLING_INTERVAL || '5000', 10),
        batchSize: parseInt(process.env.OUTBOX_BATCH_SIZE || '50', 10),
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY || '',
    },
});
//# sourceMappingURL=configuration.js.map