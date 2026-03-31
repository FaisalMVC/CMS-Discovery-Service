declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    rabbitmq: {
        url: string;
    };
    minio: {
        endpoint: string;
        port: number;
        accessKey: string;
        secretKey: string;
        bucket: string;
        useSSL: boolean;
    };
    outbox: {
        pollingInterval: number;
        batchSize: number;
    };
    youtube: {
        apiKey: string;
    };
};
export default _default;
