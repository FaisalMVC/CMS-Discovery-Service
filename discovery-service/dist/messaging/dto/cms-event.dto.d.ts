export declare class CmsEventDto {
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: Record<string, any>;
    timestamp?: string;
}
export interface ProgramPayload {
    id: string;
    title: string;
    description: string;
    type: string;
    language: string;
    thumbnailUrl: string;
    status: string;
    source: string;
    sourceId: string | null;
    categories: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
export interface EpisodePayload {
    id: string;
    title: string;
    description: string;
    episodeNumber: number;
    seasonNumber: number;
    durationSeconds: number;
    publishDate: string;
    status: string;
    source: string;
    sourceId: string | null;
    programId: string;
    programTitle: string | null;
    media: Array<{
        id: string;
        type: string;
        url: string;
        mimeType: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
