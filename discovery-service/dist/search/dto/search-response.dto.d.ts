export declare class SearchHighlight {
    title?: string[];
    description?: string[];
}
export declare class ProgramSearchHit {
    id: string;
    title: string;
    description: string;
    type: string;
    thumbnailUrl: string;
    episodeCount: number;
    highlight: SearchHighlight;
}
export declare class EpisodeSearchHit {
    id: string;
    title: string;
    programId: string;
    programTitle: string;
    durationSeconds: number;
    episodeNumber: number;
    seasonNumber: number;
    highlight: SearchHighlight;
}
export declare class SearchResponseDto {
    programs: ProgramSearchHit[];
    episodes: EpisodeSearchHit[];
}
export declare class SearchMeta {
    programsTotal: number;
    episodesTotal: number;
    page: number;
    limit: number;
}
