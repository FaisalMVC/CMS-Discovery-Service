import Redis from 'ioredis';
export declare class CacheService {
    private readonly redis;
    private readonly logger;
    constructor(redis: Redis);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
}
