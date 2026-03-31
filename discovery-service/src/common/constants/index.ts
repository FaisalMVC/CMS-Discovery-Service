export const OPENSEARCH_CLIENT = 'OPENSEARCH_CLIENT';

export const INDEX_NAMES = {
  PROGRAMS: 'programs',
  EPISODES: 'episodes',
} as const;

export const CACHE_PREFIXES = {
  PROGRAM_DETAIL: 'program:detail',
  PROGRAM_LIST: 'program:list',
  PROGRAM_EPISODES: 'program:episodes',
  EPISODE_DETAIL: 'episode:detail',
  SEARCH: 'search',
  CATEGORIES: 'categories',
} as const;

export const CACHE_TTL = {
  PROGRAM_DETAIL: 300,     
  PROGRAM_LIST: 300,       
  PROGRAM_EPISODES: 300,   
  EPISODE_DETAIL: 600,     
  SEARCH: 120,             
  CATEGORIES: 1800,        
} as const;

export const EVENT_TYPES = {
  PROGRAM_CREATED: 'PROGRAM_CREATED',
  PROGRAM_UPDATED: 'PROGRAM_UPDATED',
  PROGRAM_DELETED: 'PROGRAM_DELETED',
  EPISODE_CREATED: 'EPISODE_CREATED',
  EPISODE_UPDATED: 'EPISODE_UPDATED',
  EPISODE_DELETED: 'EPISODE_DELETED',
} as const;

export const AGGREGATE_TYPES = {
  PROGRAM: 'program',
  EPISODE: 'episode',
} as const;
