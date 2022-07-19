import { User } from '@prisma/client';

export class UserEntity implements User {
    id: number;
    name: string;
    email: string;
    password: string;
}
