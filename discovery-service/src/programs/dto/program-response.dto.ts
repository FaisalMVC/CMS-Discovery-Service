import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class ProgramSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  language: string;

  @ApiPropertyOptional()
  thumbnailUrl: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [CategoryDto] })
  categories: CategoryDto[];

  @ApiProperty()
  episodeCount: number;

  @ApiProperty()
  createdAt: string;
}

export class EpisodeSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  episodeNumber: number;

  @ApiProperty()
  seasonNumber: number;

  @ApiProperty()
  durationSeconds: number;

  @ApiProperty()
  publishDate: string;
}

export class ProgramDetailDto extends ProgramSummaryDto {
  @ApiPropertyOptional()
  source: string;

  @ApiPropertyOptional()
  sourceId: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: [EpisodeSummaryDto] })
  latestEpisodes: EpisodeSummaryDto[];
}
