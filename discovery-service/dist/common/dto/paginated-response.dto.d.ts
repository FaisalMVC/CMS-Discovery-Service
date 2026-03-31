export declare class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare class PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
    static create<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T>;
}
