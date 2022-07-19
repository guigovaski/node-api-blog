import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class UniqueConstraintError extends Error {
    constructor(e: PrismaClientKnownRequestError) {
        const uniqueField = e.meta.target[0];

        super(`A record with this ${uniqueField} already exists.`);
    }
}
