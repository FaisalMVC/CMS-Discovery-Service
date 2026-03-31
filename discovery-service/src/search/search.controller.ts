import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Full-text search',
    description:
      'Search across programs and episodes with Arabic and English support. Returns matching programs and episodes with highlights.',
  })
  @ApiOkResponse({ description: 'Search results with programs and episodes' })
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }
}
