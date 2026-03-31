"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGGREGATE_TYPES = exports.EVENT_TYPES = exports.CACHE_TTL = exports.CACHE_PREFIXES = exports.INDEX_NAMES = exports.OPENSEARCH_CLIENT = void 0;
exports.OPENSEARCH_CLIENT = 'OPENSEARCH_CLIENT';
exports.INDEX_NAMES = {
    PROGRAMS: 'programs',
    EPISODES: 'episodes',
};
exports.CACHE_PREFIXES = {
    PROGRAM_DETAIL: 'program:detail',
    PROGRAM_LIST: 'program:list',
    PROGRAM_EPISODES: 'program:episodes',
    EPISODE_DETAIL: 'episode:detail',
    SEARCH: 'search',
    CATEGORIES: 'categories',
};
exports.CACHE_TTL = {
    PROGRAM_DETAIL: 300,
    PROGRAM_LIST: 300,
    PROGRAM_EPISODES: 300,
    EPISODE_DETAIL: 600,
    SEARCH: 120,
    CATEGORIES: 1800,
};
exports.EVENT_TYPES = {
    PROGRAM_CREATED: 'PROGRAM_CREATED',
    PROGRAM_UPDATED: 'PROGRAM_UPDATED',
    PROGRAM_DELETED: 'PROGRAM_DELETED',
    EPISODE_CREATED: 'EPISODE_CREATED',
    EPISODE_UPDATED: 'EPISODE_UPDATED',
    EPISODE_DELETED: 'EPISODE_DELETED',
};
exports.AGGREGATE_TYPES = {
    PROGRAM: 'program',
    EPISODE: 'episode',
};
//# sourceMappingURL=index.js.map