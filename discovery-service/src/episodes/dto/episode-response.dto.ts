import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimeType: string;
}

export class EpisodeDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  programId: string;

  @ApiPropertyOptional()
  programTitle: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  episodeNumber: number;

  @ApiProperty()
  seasonNumber: number;

  @ApiProperty()
  durationSeconds: number;

  @ApiProperty()
  publishDate: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [MediaDto] })
  media: MediaDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
