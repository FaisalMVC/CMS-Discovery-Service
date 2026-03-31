import { Repository, DataSource } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CategoriesService } from '../categories/categories.service';
import { OutboxService } from '../outbox/outbox.service';
export declare class ProgramsService {
    private readonly programRepository;
    private readonly categoriesService;
    private readonly outboxService;
    private readonly dataSource;
    constructor(programRepository: Repository<Program>, categoriesService: CategoriesService, outboxService: OutboxService, dataSource: DataSource);
    create(dto: CreateProgramDto): Promise<Program>;
    findAll(query: PaginationQueryDto): Promise<{
        data: Program[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Program>;
    update(id: string, dto: UpdateProgramDto): Promise<Program>;
    remove(id: string): Promise<void>;
    findBySourceId(source: string, sourceId: string): Promise<Program | null>;
    private buildPayload;
}
