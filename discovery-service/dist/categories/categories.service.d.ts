import { Client } from '@opensearch-project/opensearch';
import { CacheService } from '../cache/cache.service';
export declare class CategoriesService {
    private readonly client;
    private readonly cacheService;
    private readonly logger;
    constructor(client: Client, cacheService: CacheService);
    findAll(): Promise<any>;
}
