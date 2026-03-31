import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../../common/enums/content-status.enum';

export class ImportDto {
  @ApiProperty({
    example: 'apple_podcasts',
    description: 'The source to import from (e.g. apple_podcasts)',
  })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({
    example: { podcastId: '1234567890' },
    description: 'Config specific to the source strategy',
  })
  @IsObject()
  @IsNotEmpty()
  config: Record<string, any>;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
    description: 'Status to assign to the imported program and episodes (default: draft)',
  })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiPropertyOptional({
    type: [String],
    description: 'Category UUIDs to assign to the imported program',
    example: ['uuid-1'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}