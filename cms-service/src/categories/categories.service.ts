import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });

    const existing = await this.categoryRepository.findOne({
      where: [{ name: dto.name }, { slug }],
    });

    if (existing) {
      throw new ConflictException('Category with this name or slug already exists');
    }

    const category = this.categoryRepository.create({
      name: dto.name,
      slug,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(query: PaginationQueryDto) {
    const { page =1, limit=20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.categoryRepository.findAndCount({
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.name) {
      category.name = dto.name;
      category.slug = dto.slug || slugify(dto.name, { lower: true, strict: true });
    }

    if (dto.slug) {
      category.slug = dto.slug;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    return this.categoryRepository.findByIds(ids);
  }
}
