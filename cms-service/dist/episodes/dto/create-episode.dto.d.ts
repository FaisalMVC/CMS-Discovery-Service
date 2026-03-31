import { ContentStatus } from '../../common/enums/content-status.enum';
export declare class CreateEpisodeDto {
    title: string;
    description?: string;
    episodeNumber?: number;
    seasonNumber?: number;
    durationSeconds?: number;
    publishDate?: string;
    status?: ContentStatus;
}
