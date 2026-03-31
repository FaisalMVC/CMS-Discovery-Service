import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT, INDEX_NAMES, CACHE_PREFIXES, CACHE_TTL } from '../common/constants';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @Inject(OPENSEARCH_CLIENT) private readonly client: Client,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(): Promise<any> {
    const cacheKey = `${CACHE_PREFIXES.CATEGORIES}:all`;

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const { body } = await this.client.search({
      index: INDEX_NAMES.PROGRAMS,
      body: {
        size: 0,
        query: {
          term: { status: 'published' },
        },
        aggs: {
          categories: {
            nested: {
              path: 'categories',
            },
            aggs: {
              unique_categories: {
                terms: {
                  field: 'categories.slug',
                  size: 100,
                },
                aggs: {
                  category_name: {
                    terms: {
                      field: 'categories.name.keyword',
                      size: 1,
                    },
                  },
                  category_id: {
                    terms: {
                      field: 'categories.id',
                      size: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const buckets =
      body.aggregations?.categories?.unique_categories?.buckets || [];

    const categories = buckets.map((bucket: any) => {
    const nameBuckets = bucket.category_name?.buckets ?? [];
    const idBuckets = bucket.category_id?.buckets ?? [];

    const firstNameBucket = nameBuckets.at(0);
    const firstIdBucket = idBuckets.at(0);

    return {
        slug: bucket.key,
        name: firstNameBucket ? firstNameBucket.key : bucket.key,
        id: firstIdBucket ? firstIdBucket.key : null,
        programCount: bucket.doc_count,
    };
    });


    const result = { data: categories };

    await this.cacheService.set(cacheKey, result, CACHE_TTL.CATEGORIES);

    return result;
  }
}
