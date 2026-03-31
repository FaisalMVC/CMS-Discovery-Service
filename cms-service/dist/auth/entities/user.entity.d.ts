import { UserRole } from '../../common/enums/user-role.enum';
export declare class User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
