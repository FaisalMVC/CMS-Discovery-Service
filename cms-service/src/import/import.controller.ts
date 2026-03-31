import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportDto } from './dto/import.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Import a program from an external source' })
  @ApiResponse({
    status: 201,
    description: 'Import successful',
    schema: {
      type: 'object',
      properties: {
        program: { type: 'object' },
        episodesImported: { type: 'number', example: 25 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Unknown source or invalid config' })
  import(@Body() dto: ImportDto) {
    return this.importService.import(dto.source, dto.config, dto.status, dto.categoryIds);
  }
}