import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProgramType } from '../../common/enums/program-type.enum';
import { ContentStatus } from '../../common/enums/content-status.enum';

export class CreateProgramDto {
  @ApiProperty({ example: 'فنجان' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'بودكاست حواري يستضيف شخصيات مؤثرة' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ProgramType, example: ProgramType.PODCAST })
  @IsEnum(ProgramType)
  type: ProgramType;

  @ApiPropertyOptional({ example: 'ar' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.PUBLISHED })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiPropertyOptional({
    type: [String],
    example: ['uuid-1', 'uuid-2'],
    description: 'Array of category UUIDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
