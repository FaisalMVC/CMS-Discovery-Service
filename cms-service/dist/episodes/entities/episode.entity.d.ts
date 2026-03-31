import { ContentStatus } from '../../common/enums/content-status.enum';
import { Program } from '../../programs/entities/program.entity';
import { Media } from '../../media/entities/media.entity';
export declare class Episode {
    id: string;
    title: string;
    description: string;
    episodeNumber: number;
    seasonNumber: number;
    durationSeconds: number;
    publishDate: Date;
    status: ContentStatus;
    source: string;
    sourceId: string;
    programId: string;
    createdAt: Date;
    updatedAt: Date;
    program: Program;
    media: Media[];
}
