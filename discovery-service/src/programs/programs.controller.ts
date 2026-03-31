import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { ListProgramsQueryDto } from './dto/list-programs-query.dto';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({
    summary: 'List programs',
    description: 'Browse programs with pagination, filtering, and sorting',
  })
  @ApiOkResponse({ description: 'Paginated list of programs' })
  async findAll(@Query() query: ListProgramsQueryDto) {
    return this.programsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get program detail',
    description: 'Get a single program with its latest episodes',
  })
  @ApiParam({ name: 'id', description: 'Program UUID' })
  @ApiOkResponse({ description: 'Program detail with latest episodes' })
  @ApiNotFoundResponse({ description: 'Program not found' })
  async findById(@Param('id') id: string) {
    return this.programsService.findById(id);
  }
}
