import { ImportService } from './import.service';
import { ImportDto } from './dto/import.dto';
export declare class ImportController {
    private readonly importService;
    constructor(importService: ImportService);
    import(dto: ImportDto): Promise<{
        program: import("../programs/entities/program.entity").Program;
        episodesImported: number;
    }>;
}
