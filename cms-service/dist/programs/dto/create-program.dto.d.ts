import { ProgramType } from '../../common/enums/program-type.enum';
import { ContentStatus } from '../../common/enums/content-status.enum';
export declare class CreateProgramDto {
    title: string;
    description?: string;
    type: ProgramType;
    language?: string;
    thumbnailUrl?: string;
    status?: ContentStatus;
    categoryIds?: string[];
}
