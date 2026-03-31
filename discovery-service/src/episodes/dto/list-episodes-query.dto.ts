import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListEpisodesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by season number' })
  @IsOptional()
  @IsInt()
  season?: number;

  @ApiPropertyOptional({ description: 'Filter by status', default: 'published' })
  @IsOptional()
  @IsString()
  status?: string = 'published';

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['episodeNumber', 'publishDate', 'createdAt'],
    default: 'episodeNumber',
  })
  @IsOptional()
  @IsIn(['episodeNumber', 'publishDate', 'createdAt'])
  sortBy?: string = 'episodeNumber';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
