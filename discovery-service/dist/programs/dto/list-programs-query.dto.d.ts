import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
export declare class ListProgramsQueryDto extends PaginationQueryDto {
    category?: string;
    language?: string;
    type?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
