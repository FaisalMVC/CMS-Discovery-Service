import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchHighlight {
  @ApiPropertyOptional({ type: [String] })
  title?: string[];

  @ApiPropertyOptional({ type: [String] })
  description?: string[];
}

export class ProgramSearchHit {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  thumbnailUrl: string;

  @ApiProperty()
  episodeCount: number;

  @ApiProperty()
  highlight: SearchHighlight;
}

export class EpisodeSearchHit {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  programId: string;

  @ApiPropertyOptional()
  programTitle: string;

  @ApiProperty()
  durationSeconds: number;

  @ApiProperty()
  episodeNumber: number;

  @ApiProperty()
  seasonNumber: number;

  @ApiProperty()
  highlight: SearchHighlight;
}

export class SearchResponseDto {
  @ApiProperty({ type: [ProgramSearchHit] })
  programs: ProgramSearchHit[];

  @ApiProperty({ type: [EpisodeSearchHit] })
  episodes: EpisodeSearchHit[];
}

export class SearchMeta {
  @ApiProperty()
  programsTotal: number;

  @ApiProperty()
  episodesTotal: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
