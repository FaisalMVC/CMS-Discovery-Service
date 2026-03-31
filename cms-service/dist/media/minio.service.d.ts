import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class MinioService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private readonly client;
    private readonly bucketName;
    private readonly endpoint;
    private readonly port;
    private readonly protocol;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucket;
    putObject(objectName: string, buffer: Buffer, size: number, contentType: string): Promise<void>;
    removeObject(objectName: string): Promise<void>;
    buildObjectUrl(objectName: string): string;
    getBucketName(): string;
}
