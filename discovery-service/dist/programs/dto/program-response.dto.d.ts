export declare class CategoryDto {
    id: string;
    name: string;
    slug: string;
}
export declare class ProgramSummaryDto {
    id: string;
    title: string;
    description: string;
    type: string;
    language: string;
    thumbnailUrl: string;
    status: string;
    categories: CategoryDto[];
    episodeCount: number;
    createdAt: string;
}
export declare class EpisodeSummaryDto {
    id: string;
    title: string;
    episodeNumber: number;
    seasonNumber: number;
    durationSeconds: number;
    publishDate: string;
}
export declare class ProgramDetailDto extends ProgramSummaryDto {
    source: string;
    sourceId: string;
    updatedAt: string;
    latestEpisodes: EpisodeSummaryDto[];
}
