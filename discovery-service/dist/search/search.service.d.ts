import { Client } from '@opensearch-project/opensearch';
import { CacheService } from '../cache/cache.service';
import { SearchQueryDto } from './dto/search-query.dto';
export declare class SearchService {
    private readonly client;
    private readonly cacheService;
    private readonly logger;
    constructor(client: Client, cacheService: CacheService);
    search(query: SearchQueryDto): Promise<any>;
    private extractTotal;
}
