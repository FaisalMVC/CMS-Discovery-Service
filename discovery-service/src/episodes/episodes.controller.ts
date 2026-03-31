import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EpisodesService } from './episodes.service';
import { ListEpisodesQueryDto } from './dto/list-episodes-query.dto';

@ApiTags('episodes')
@Controller()
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get('programs/:programId/episodes')
  @ApiOperation({
    summary: 'List episodes of a program',
    description: 'Get paginated episodes for a specific program, with optional season filter',
  })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Paginated list of episodes' })
  async findByProgramId(
    @Param('programId') programId: string,
    @Query() query: ListEpisodesQueryDto,
  ) {
    return this.episodesService.findByProgramId(programId, query);
  }

  @Get('episodes/:id')
  @ApiOperation({
    summary: 'Get episode detail',
    description: 'Get a single episode with full details including media',
  })
  @ApiParam({ name: 'id', description: 'Episode UUID' })
  @ApiOkResponse({ description: 'Episode detail' })
  @ApiNotFoundResponse({ description: 'Episode not found' })
  async findById(@Param('id') id: string) {
    return this.episodesService.findById(id);
  }
}
