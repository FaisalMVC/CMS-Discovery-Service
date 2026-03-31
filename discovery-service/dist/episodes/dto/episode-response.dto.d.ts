export declare class MediaDto {
    id: string;
    type: string;
    url: string;
    mimeType: string;
}
export declare class EpisodeDetailDto {
    id: string;
    programId: string;
    programTitle: string;
    title: string;
    description: string;
    episodeNumber: number;
    seasonNumber: number;
    durationSeconds: number;
    publishDate: string;
    status: string;
    media: MediaDto[];
    createdAt: string;
    updatedAt: string;
}
