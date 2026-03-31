import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ProgramsController {
    private readonly programsService;
    constructor(programsService: ProgramsService);
    create(dto: CreateProgramDto): Promise<import("./entities/program.entity").Program>;
    findAll(query: PaginationQueryDto): Promise<{
        data: import("./entities/program.entity").Program[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/program.entity").Program>;
    update(id: string, dto: UpdateProgramDto): Promise<import("./entities/program.entity").Program>;
    remove(id: string): Promise<void>;
}
