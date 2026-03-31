import { Client } from '@opensearch-project/opensearch';
export declare class ProgramsRepository {
    private readonly client;
    private readonly logger;
    private readonly index;
    constructor(client: Client);
    upsert(id: string, document: Record<string, any>): Promise<void>;
    updatePartial(id: string, partialDoc: Record<string, any>): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Record<string, any> | null>;
    search(params: {
        page: number;
        limit: number;
        category?: string;
        language?: string;
        type?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        hits: Record<string, any>[];
        total: number;
    }>;
}
