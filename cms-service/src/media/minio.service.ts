import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Minio.Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  private readonly publicEndpoint: string;
  private readonly port: number;
  private readonly protocol: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('minio.bucket') ?? '';
    this.endpoint = this.configService.get<string>('minio.endpoint') ?? '';
    this.publicEndpoint = this.configService.get<string>('minio.publicEndpoint') ?? '';
    this.port = this.configService.get<number>('minio.port') ?? 9000;
    this.protocol = this.configService.get<boolean>('minio.useSSL') ? 'https' : 'http';

    this.client = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.configService.get<boolean>('minio.useSSL') ?? false,
      accessKey: this.configService.get<string>('minio.accessKey') ?? '',
      secretKey: this.configService.get<string>('minio.secretKey') ?? '',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        this.logger.log(`Bucket "${this.bucketName}" created`);
      } else {
        this.logger.log(`Bucket "${this.bucketName}" already exists`);
      }

      await this.client.setBucketPolicy(
        this.bucketName,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        }),
      );


    } catch (error) {
      this.logger.error(`Failed to ensure bucket: ${error.message}`);
    }
  }

  async putObject(
    objectName: string,
    buffer: Buffer,
    size: number,
    contentType: string,
  ): Promise<void> {
    await this.client.putObject(
      this.bucketName,
      objectName,
      buffer,
      size,
      { 'Content-Type': contentType },
    );
  }

  async removeObject(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucketName, objectName);
  }

  buildObjectUrl(objectName: string): string {
    return `${this.protocol}://${this.publicEndpoint}:${this.port}/${this.bucketName}/${objectName}`;
  }

  getBucketName(): string {
    return this.bucketName;
  }
}
