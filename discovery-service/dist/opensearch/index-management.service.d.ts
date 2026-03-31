import { OnModuleInit } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
export declare class IndexManagementService implements OnModuleInit {
    private readonly client;
    private readonly logger;
    constructor(client: Client);
    onModuleInit(): Promise<void>;
    private ensureIndices;
    private createIndexIfNotExists;
    private getAnalysisSettings;
    private getProgramsMapping;
    private getEpisodesMapping;
}
