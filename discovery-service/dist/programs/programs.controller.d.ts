import { ProgramsService } from './programs.service';
import { ListProgramsQueryDto } from './dto/list-programs-query.dto';
export declare class ProgramsController {
    private readonly programsService;
    constructor(programsService: ProgramsService);
    findAll(query: ListProgramsQueryDto): Promise<import("../common/dto/paginated-response.dto").PaginatedResponse<any>>;
    findById(id: string): Promise<any>;
}
