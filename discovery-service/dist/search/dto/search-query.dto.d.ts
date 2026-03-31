import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
export declare class SearchQueryDto extends PaginationQueryDto {
    q: string;
    type?: string;
    language?: string;
    category?: string;
}
