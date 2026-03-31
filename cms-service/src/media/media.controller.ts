import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('episodes/:episodeId/media')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5000 * 1024 * 1024 }, 
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media for an episode (file or URL)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Media file' },
        type: {
          type: 'string',
          enum: ['video', 'audio', 'thumbnail'],
        },
        url: { type: 'string', description: 'External URL (alternative to file)' },
      },
      required: ['type'],
    },
  })
  @ApiResponse({ status: 201, description: 'Media uploaded' })
  upload(
    @Param('episodeId', ParseUUIDPipe) episodeId: string,
    @Body() dto: CreateMediaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.mediaService.upload(episodeId, dto, file);
  }

  @Delete('media/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a media entry and its file' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }
}
