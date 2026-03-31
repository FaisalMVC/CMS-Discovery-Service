import { MediaType } from '../../common/enums/media-type.enum';
import { Episode } from '../../episodes/entities/episode.entity';
export declare class Media {
    id: string;
    episodeId: string;
    type: MediaType;
    url: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: Date;
    episode: Episode;
}
