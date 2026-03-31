import { Injectable, Inject, Logger } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT, INDEX_NAMES } from '../common/constants';

@Injectable()
export class ProgramsRepository {
  private readonly logger = new Logger(ProgramsRepository.name);
  private readonly index = INDEX_NAMES.PROGRAMS;

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

  async updatePartial(id: string, partialDoc: Record<string, any>): Promise<void> {
    try {
      await this.client.update({
        index: this.index,
        id,
        body: { doc: partialDoc },
        refresh: 'wait_for',
      });
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        this.logger.warn(`Program ${id} not found for partial update`);
        return;
      }
      throw error;
    }
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
        this.logger.warn(`Program ${id} not found for deletion`);
        return;
      }
      throw error;
    }
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

  async search(params: {
    page: number;
    limit: number;
    category?: string;
    language?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ hits: Record<string, any>[]; total: number }> {
    const { page, limit, category, language, type, status, sortBy, sortOrder } = params;
    const from = (page - 1) * limit;

    const must: any[] = [];
    const filter: any[] = [];

    if (status) {
      filter.push({ term: { status } });
    }

    if (language) {
      filter.push({ term: { language } });
    }

    if (type) {
      filter.push({ term: { type } });
    }

    if (category) {
      must.push({
        nested: {
          path: 'categories',
          query: {
            term: { 'categories.slug': category },
          },
        },
      });
    }

    // Build sort
    const sort: any[] = [];
    if (sortBy === 'title') {
      sort.push({ 'title.keyword': { order: sortOrder } });
    } else if (sortBy === 'episodeCount') {
      sort.push({ episodeCount: { order: sortOrder } });
    } else {
      sort.push({ createdAt: { order: sortOrder } });
    }

    const query: any = {
      bool: {
        must: must.length > 0 ? must : [{ match_all: {} }],
        filter,
      },
    };

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
