import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export function isPrismaError(e: PrismaClientKnownRequestError) {
    return (
        typeof e.code === 'string' &&
        typeof e.clientVersion === 'string' &&
        (typeof e.meta === 'undefined' || typeof e.meta === 'object')
    );
}
