import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT, INDEX_NAMES } from '../common/constants';

@Injectable()
export class EpisodesRepository {
  private readonly logger = new Logger(EpisodesRepository.name);
  private readonly index = INDEX_NAMES.EPISODES;

  constructor(
    @Inject(OPENSEARCH_CLIENT) private readonly client: Client,
  ) {}

  async upsert(id: string, document: Record<string, any>): Promise<void> {
    await this.client.index({
      index: this.index,
      id,
      body: document,
      refresh: 'wait_for',
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.index,
        id,
        refresh: 'wait_for',
      });
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        this.logger.warn(`Episode ${id} not found for deletion`);
        return;
      }
      throw error;
    }
  }

  async deleteByProgramId(programId: string): Promise<void> {
    await this.client.deleteByQuery({
      index: this.index,
      body: {
        query: {
          term: { programId },
        },
      },
      refresh: true,
    });
    this.logger.log(`Deleted all episodes for program ${programId}`);
  }

  async findById(id: string): Promise<Record<string, any> | null> {
    try {
      const { body } = await this.client.get({
        index: this.index,
        id,
      });
      return body._source;
    } catch (error) {
      if (error.meta?.statusCode === 404) return null;
      throw error;
    }
  }

  async countByProgramId(programId: string): Promise<number> {
    try {
      const { body } = await this.client.count({
        index: this.index,
        body: {
          query: {
            bool: {
              filter: [
                { term: { programId } },
                { term: { status: 'published' } },
              ],
            },
          },
        },
      });
      return body.count;
    } catch (error) {
      this.logger.warn(`Failed to count episodes for program ${programId}: ${error.message}`);
      return 0;
    }
  }

  async search(params: {
    programId?: string;
    status?: string;
    season?: number;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ hits: Record<string, any>[]; total: number }> {
    const { programId, status, season, page, limit, sortBy, sortOrder } = params;
    const from = (page - 1) * limit;

    const filter: any[] = [];

    if (programId) {
      filter.push({ term: { programId } });
    }

    if (status) {
      filter.push({ term: { status } });
    }

    if (season !== undefined && season !== null) {
      filter.push({ term: { seasonNumber: season } });
    }

    const sort: any[] = [];
    if (sortBy === 'publishDate') {
      sort.push({ publishDate: { order: sortOrder } });
    } else if (sortBy === 'createdAt') {
      sort.push({ createdAt: { order: sortOrder } });
    } else {
      sort.push({ episodeNumber: { order: sortOrder } });
    }

    const query: any = {
      bool: {
        filter,
      },
    };

    if (filter.length === 0) {
      query.bool.must = [{ match_all: {} }];
    }

    const { body } = await this.client.search({
      index: this.index,
      body: {
        query,
        sort,
        from,
        size: limit,
      },
    });

    const total =
      typeof body.hits.total === 'number'
        ? body.hits.total
        : body.hits.total.value;

    return {
      hits: body.hits.hits.map((hit: any) => hit._source),
      total,
    };
  }
}
