import { ProgramType } from '../../common/enums/program-type.enum';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { Category } from '../../categories/entities/category.entity';
import { Episode } from '../../episodes/entities/episode.entity';
export declare class Program {
    id: string;
    title: string;
    description: string;
    type: ProgramType;
    language: string;
    thumbnailUrl: string;
    status: ContentStatus;
    source: string;
    sourceId: string;
    createdAt: Date;
    updatedAt: Date;
    categories: Category[];
    episodes: Episode[];
}
