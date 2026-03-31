import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CategoriesService } from '../categories/categories.service';
import { OutboxService } from '../outbox/outbox.service';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly categoriesService: CategoriesService,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateProgramDto): Promise<Program> {
    return this.dataSource.transaction(async (manager) => {
      const program = manager.create(Program, {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        language: dto.language || 'ar',
        thumbnailUrl: dto.thumbnailUrl,
        status: dto.status,
      });

      if (dto.categoryIds?.length) {
        program.categories = await this.categoriesService.findByIds(dto.categoryIds);
      }

      const savedProgram = await manager.save(Program, program);

      await this.outboxService.createEntry(
        manager,
        'program',
        savedProgram.id,
        EventType.CREATED,
        this.buildPayload(savedProgram),
      );

      return savedProgram;
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1 , limit =20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.programRepository.findAndCount({
      relations: ['categories'],
      order: { createdAt: 'DESC' },
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

  async findOne(id: string): Promise<Program> {
    const program = await this.programRepository.findOne({
      where: { id },
      relations: ['categories', 'episodes'],
    });

    if (!program) {
      throw new NotFoundException(`Program with ID "${id}" not found`);
    }

    return program;
  }

  async update(id: string, dto: UpdateProgramDto): Promise<Program> {
    return this.dataSource.transaction(async (manager) => {
      const program = await manager.findOne(Program, {
        where: { id },
        relations: ['categories'],
      });

      if (!program) {
        throw new NotFoundException(`Program with ID "${id}" not found`);
      }
      if (dto.title !== undefined) program.title = dto.title;
      if (dto.description !== undefined) program.description = dto.description;
      if (dto.type !== undefined) program.type = dto.type;
      if (dto.language !== undefined) program.language = dto.language;
      if (dto.thumbnailUrl !== undefined) program.thumbnailUrl = dto.thumbnailUrl;
      if (dto.status !== undefined) program.status = dto.status;

      if (dto.categoryIds) {
        program.categories = await this.categoriesService.findByIds(dto.categoryIds);
      }

      const updatedProgram = await manager.save(Program, program);

      await this.outboxService.createEntry(
        manager,
        'program',
        updatedProgram.id,
        EventType.UPDATED,
        this.buildPayload(updatedProgram),
      );

      return updatedProgram;
    });
  }

  async remove(id: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const program = await manager.findOne(Program, {
        where: { id },
      });

      if (!program) {
        throw new NotFoundException(`Program with ID "${id}" not found`);
      }

      await this.outboxService.createEntry(
        manager,
        'program',
        program.id,
        EventType.DELETED,
        { id: program.id },
      );

      await manager.remove(Program, program);
    });
  }
  async findBySourceId(source: string, sourceId: string): Promise<Program | null> {
    return this.programRepository.findOne({
      where: { source, sourceId },
      relations: ['categories'],
    });
  }

  private buildPayload(program: Program): Record<string, any> {
    return {
      id: program.id,
      title: program.title,
      description: program.description,
      type: program.type,
      language: program.language,
      thumbnailUrl: program.thumbnailUrl,
      status: program.status,
      source: program.source,
      sourceId: program.sourceId,
      categories: program.categories?.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })) || [],
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  }
}
