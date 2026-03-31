"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_service_1 = require("./cache.service");
const redis_config_1 = require("../config/redis.config");
const ioredis_1 = require("ioredis");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(redis_config_1.default)],
        providers: [
            {
                provide: 'REDIS_CLIENT',
                useFactory: (configService) => {
                    return new ioredis_1.default({
                        host: configService.get('redis.host'),
                        port: configService.get('redis.port'),
                    });
                },
                inject: [config_1.ConfigService],
            },
            cache_service_1.CacheService,
        ],
        exports: [cache_service_1.CacheService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map