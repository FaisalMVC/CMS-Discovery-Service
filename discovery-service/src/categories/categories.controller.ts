import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'List categories',
    description:
      'Get all categories with program counts. Built from aggregation on published programs.',
  })
  @ApiOkResponse({ description: 'List of categories with program counts' })
  async findAll() {
    return this.categoriesService.findAll();
  }
}
