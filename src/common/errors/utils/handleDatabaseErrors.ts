import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UniqueConstraintError } from '../types/UniqueConstraintError';

enum PrismaErrors {
    UniqueCostraintFail = 'P2002',
}

export function handleDatabaseErrors(e: PrismaClientKnownRequestError) {
    switch (e.code) {
        case PrismaErrors.UniqueCostraintFail:
            return new UniqueConstraintError(e);

        default:
            return new BadRequestException(e.message);
    }
}
