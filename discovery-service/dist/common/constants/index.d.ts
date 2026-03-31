export declare const OPENSEARCH_CLIENT = "OPENSEARCH_CLIENT";
export declare const INDEX_NAMES: {
    readonly PROGRAMS: "programs";
    readonly EPISODES: "episodes";
};
export declare const CACHE_PREFIXES: {
    readonly PROGRAM_DETAIL: "program:detail";
    readonly PROGRAM_LIST: "program:list";
    readonly PROGRAM_EPISODES: "program:episodes";
    readonly EPISODE_DETAIL: "episode:detail";
    readonly SEARCH: "search";
    readonly CATEGORIES: "categories";
};
export declare const CACHE_TTL: {
    readonly PROGRAM_DETAIL: 300;
    readonly PROGRAM_LIST: 300;
    readonly PROGRAM_EPISODES: 300;
    readonly EPISODE_DETAIL: 600;
    readonly SEARCH: 120;
    readonly CATEGORIES: 1800;
};
export declare const EVENT_TYPES: {
    readonly PROGRAM_CREATED: "PROGRAM_CREATED";
    readonly PROGRAM_UPDATED: "PROGRAM_UPDATED";
    readonly PROGRAM_DELETED: "PROGRAM_DELETED";
    readonly EPISODE_CREATED: "EPISODE_CREATED";
    readonly EPISODE_UPDATED: "EPISODE_UPDATED";
    readonly EPISODE_DELETED: "EPISODE_DELETED";
};
export declare const AGGREGATE_TYPES: {
    readonly PROGRAM: "program";
    readonly EPISODE: "episode";
};
