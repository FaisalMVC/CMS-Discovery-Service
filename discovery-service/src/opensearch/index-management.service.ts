import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT, INDEX_NAMES } from '../common/constants';

@Injectable()
export class IndexManagementService implements OnModuleInit {
  private readonly logger = new Logger(IndexManagementService.name);

  constructor(
    @Inject(OPENSEARCH_CLIENT) private readonly client: Client,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.waitForOpenSearch();
    await this.createIndexIfNotExists(INDEX_NAMES.PROGRAMS, this.getProgramsMapping());
    await this.createIndexIfNotExists(INDEX_NAMES.EPISODES, this.getEpisodesMapping());
  }

  private async waitForOpenSearch(retries = 10, delayMs = 5000): Promise<void> {
    for (let i = 1; i <= retries; i++) {
      try {
        await this.client.cluster.health({});
        this.logger.log('OpenSearch is ready');
        return;
      } catch {
        this.logger.warn(`OpenSearch not ready, attempt ${i}/${retries}. Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw new Error('OpenSearch did not become ready in time');
  }

  private async createIndexIfNotExists(
    indexName: string,
    body: Record<string, any>,
  ): Promise<void> {
    try {
      const { body: exists } = await this.client.indices.exists({ index: indexName });

      if (!exists) {
        await this.client.indices.create({ index: indexName, body });
        this.logger.log(`Index "${indexName}" created successfully`);
      } else {
        this.logger.log(`Index "${indexName}" already exists`);
      }
    } catch (error) {
      this.logger.error(`Failed to create index "${indexName}": ${error.message}`);
      throw error;
    }
  }

  private getAnalysisSettings(): Record<string, any> {
    return {
      analysis: {
        analyzer: {
          arabic_english: {
            type: 'custom',
            tokenizer: 'standard',
            filter: [
              'lowercase',
              'arabic_normalization',
              'arabic_stemmer',
              'english_stemmer',
            ],
          },
        },
        filter: {
          arabic_stemmer: { type: 'stemmer', language: 'arabic' },
          english_stemmer: { type: 'stemmer', language: 'english' },
        },
      },
    };
  }

  private getProgramsMapping(): Record<string, any> {
    return {
      settings: {
        number_of_shards: 2,
        number_of_replicas: 1,
        ...this.getAnalysisSettings(),
      },
      mappings: {
        properties: {
          id:           { type: 'keyword' },
          title:        { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
          description:  { type: 'text', analyzer: 'arabic_english' },
          type:         { type: 'keyword' },
          language:     { type: 'keyword' },
          thumbnailUrl: { type: 'keyword', index: false },
          status:       { type: 'keyword' },
          source:       { type: 'keyword' },
          sourceId:     { type: 'keyword' },
          categories: {
            type: 'nested',
            properties: {
              id:   { type: 'keyword' },
              name: { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
              slug: { type: 'keyword' },
            },
          },
          episodeCount: { type: 'integer' },
          createdAt:    { type: 'date' },
          updatedAt:    { type: 'date' },
        },
      },
    };
  }

  private getEpisodesMapping(): Record<string, any> {
    return {
      settings: {
        number_of_shards: 3,
        number_of_replicas: 1,
        ...this.getAnalysisSettings(),
      },
      mappings: {
        properties: {
          id:              { type: 'keyword' },
          programId:       { type: 'keyword' },
          programTitle:    { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
          title:           { type: 'text', analyzer: 'arabic_english', fields: { keyword: { type: 'keyword' } } },
          description:     { type: 'text', analyzer: 'arabic_english' },
          episodeNumber:   { type: 'integer' },
          seasonNumber:    { type: 'integer' },
          durationSeconds: { type: 'integer' },
          publishDate:     { type: 'date' },
          status:          { type: 'keyword' },
          source:          { type: 'keyword' },
          sourceId:        { type: 'keyword' },
          media: {
            type: 'nested',
            properties: {
              id:       { type: 'keyword' },
              type:     { type: 'keyword' },
              url:      { type: 'keyword', index: false },
              mimeType: { type: 'keyword' },
            },
          },
          createdAt:  { type: 'date' },
          updatedAt:  { type: 'date' },
        },
      },
    };
  }
}