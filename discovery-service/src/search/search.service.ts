import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT, INDEX_NAMES, CACHE_PREFIXES, CACHE_TTL } from '../common/constants';
import { CacheService } from '../cache/cache.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject(OPENSEARCH_CLIENT) private readonly client: Client,
    private readonly cacheService: CacheService,
  ) {}

  async search(query: SearchQueryDto): Promise<any> {
    const cacheKey = buildCacheKey(CACHE_PREFIXES.SEARCH, query);

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const from = (query.page - 1) * query.limit;

    const programFilters: any[] = [{ term: { status: 'published' } }];
    const episodeFilters: any[] = [{ term: { status: 'published' } }];

    if (query.language) {
      programFilters.push({ term: { language: query.language } });
    }

    if (query.type) {
      programFilters.push({ term: { type: query.type } });
    }

    if (query.category) {
      programFilters.push({
        nested: {
          path: 'categories',
          query: { term: { 'categories.slug': query.category } },
        },
      });
    }

    const { body } = await this.client.msearch({
      body: [
        { index: INDEX_NAMES.PROGRAMS },
        {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: query.q,
                  fields: ['title^3', 'description', 'categories.name'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                },
              },
              filter: programFilters,
            },
          },
          highlight: {
            fields: {
              title: { number_of_fragments: 1 },
              description: { number_of_fragments: 2, fragment_size: 150 },
            },
            pre_tags: ['<em>'],
            post_tags: ['</em>'],
          },
          from,
          size: query.limit,
        },
        { index: INDEX_NAMES.EPISODES },
        {
          query: {
            bool: {
              must: {
                multi_match: {
                  query: query.q,
                  fields: ['title^3', 'description', 'programTitle'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                },
              },
              filter: episodeFilters,
            },
          },
          highlight: {
            fields: {
              title: { number_of_fragments: 1 },
              description: { number_of_fragments: 2, fragment_size: 150 },
            },
            pre_tags: ['<em>'],
            post_tags: ['</em>'],
          },
          from,
          size: query.limit,
        },
      ],
    });

    const responses = body.responses || [];
    const programsResponse = responses.at(0);
    const episodesResponse = responses.at(1);

    const programsTotal = this.extractTotal(programsResponse);
    const episodesTotal = this.extractTotal(episodesResponse);

    const programHits = programsResponse?.hits?.hits || [];
    const episodeHits = episodesResponse?.hits?.hits || [];

    const result = {
      data: {
        programs: programHits.map((hit: any) => ({
          id: hit._source.id,
          title: hit._source.title,
          description: hit._source.description,
          type: hit._source.type,
          thumbnailUrl: hit._source.thumbnailUrl,
          episodeCount: hit._source.episodeCount,
          categories: hit._source.categories,
          highlight: hit.highlight || {},
        })),
        episodes: episodeHits.map((hit: any) => ({
          id: hit._source.id,
          title: hit._source.title,
          programId: hit._source.programId,
          programTitle: hit._source.programTitle,
          durationSeconds: hit._source.durationSeconds,
          episodeNumber: hit._source.episodeNumber,
          seasonNumber: hit._source.seasonNumber,
          publishDate: hit._source.publishDate,
          highlight: hit.highlight || {},
        })),
      },
      meta: {
        programsTotal,
        episodesTotal,
        page: query.page,
        limit: query.limit,
      },
    };

    await this.cacheService.set(cacheKey, result, CACHE_TTL.SEARCH);

    return result;
  }

  private extractTotal(response: any): number {
    if (!response?.hits?.total) return 0;

    const total = response.hits.total;
    return typeof total === 'number' ? total : total.value || 0;
  }
}
