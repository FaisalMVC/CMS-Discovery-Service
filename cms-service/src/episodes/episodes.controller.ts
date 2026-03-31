import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Episodes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Post('programs/:programId/episodes')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Create an episode for a program' })
  @ApiResponse({ status: 201, description: 'Episode created' })
  create(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body() dto: CreateEpisodeDto,
  ) {
    return this.episodesService.create(programId, dto);
  }

  @Get('programs/:programId/episodes')
  @ApiOperation({ summary: 'List all episodes for a program (paginated)' })
  findAllByProgram(
    @Param('programId', ParseUUIDPipe) programId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.episodesService.findAllByProgram(programId, query);
  }

  @Get('episodes/:id')
  @ApiOperation({ summary: 'Get an episode by ID' })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.episodesService.findOne(id);
  }

  @Patch('episodes/:id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Update an episode' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEpisodeDto,
  ) {
    return this.episodesService.update(id, dto);
  }

  @Delete('episodes/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an episode' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.episodesService.remove(id);
  }
}
