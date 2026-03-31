import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '../../common/enums/media-type.enum';

export class CreateMediaDto {
  @ApiProperty({ enum: MediaType, example: MediaType.VIDEO })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiPropertyOptional({ description: 'Optional URL if not uploading a file' })
  @IsString()
  @IsOptional()
  url?: string;
}
