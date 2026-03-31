import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
export declare class ListEpisodesQueryDto extends PaginationQueryDto {
    season?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
