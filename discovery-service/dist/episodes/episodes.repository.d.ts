import { Client } from '@opensearch-project/opensearch';
export declare class EpisodesRepository {
    private readonly client;
    private readonly logger;
    private readonly index;
    constructor(client: Client);
    upsert(id: string, document: Record<string, any>): Promise<void>;
    delete(id: string): Promise<void>;
    deleteByProgramId(programId: string): Promise<void>;
    findById(id: string): Promise<Record<string, any> | null>;
    countByProgramId(programId: string): Promise<number>;
    search(params: {
        programId?: string;
        status?: string;
        season?: number;
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        hits: Record<string, any>[];
        total: number;
    }>;
}
