"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MinioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
let MinioService = MinioService_1 = class MinioService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MinioService_1.name);
        this.bucketName = this.configService.get('minio.bucket') ?? '';
        this.endpoint = this.configService.get('minio.endpoint') ?? '';
        this.port = this.configService.get('minio.port') ?? 9000;
        this.protocol = this.configService.get('minio.useSSL') ? 'https' : 'http';
        this.client = new Minio.Client({
            endPoint: this.endpoint,
            port: this.port,
            useSSL: this.configService.get('minio.useSSL') ?? false,
            accessKey: this.configService.get('minio.accessKey') ?? '',
            secretKey: this.configService.get('minio.secretKey') ?? '',
        });
    }
    async onModuleInit() {
        await this.ensureBucket();
    }
    async ensureBucket() {
        try {
            const exists = await this.client.bucketExists(this.bucketName);
            if (!exists) {
                await this.client.makeBucket(this.bucketName);
                this.logger.log(`Bucket "${this.bucketName}" created`);
            }
            else {
                this.logger.log(`Bucket "${this.bucketName}" already exists`);
            }
            await this.client.setBucketPolicy(this.bucketName, JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                    },
                ],
            }));
        }
        catch (error) {
            this.logger.error(`Failed to ensure bucket: ${error.message}`);
        }
    }
    async putObject(objectName, buffer, size, contentType) {
        await this.client.putObject(this.bucketName, objectName, buffer, size, { 'Content-Type': contentType });
    }
    async removeObject(objectName) {
        await this.client.removeObject(this.bucketName, objectName);
    }
    buildObjectUrl(objectName) {
        return `${this.protocol}://${this.endpoint}:${this.port}/${this.bucketName}/${objectName}`;
    }
    getBucketName() {
        return this.bucketName;
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = MinioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map