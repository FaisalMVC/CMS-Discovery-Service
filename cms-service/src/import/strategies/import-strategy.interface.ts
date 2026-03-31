import { ProgramType } from '../../common/enums/program-type.enum';

export interface NormalizedEpisode {
  title: string;
  description?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  durationSeconds?: number;
  publishDate?: string;
  sourceId: string;
  audioUrl?: string;
  thumbnailUrl?: string;
}

export interface NormalizedProgram {
  title: string;
  description?: string;
  type: ProgramType;
  language?: string;
  thumbnailUrl?: string;
  source: string;
  sourceId: string;
  episodes: NormalizedEpisode[];
}

export interface ImportStrategy {
  fetch(config: Record<string, any>): Promise<NormalizedProgram>;
}