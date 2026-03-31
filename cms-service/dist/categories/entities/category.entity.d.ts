import { Program } from '../../programs/entities/program.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    programs: Program[];
}
