import { ContentStatus } from '../../common/enums/content-status.enum';
export declare class ImportDto {
    source: string;
    config: Record<string, any>;
    status?: ContentStatus;
    categoryIds?: string[];
}
