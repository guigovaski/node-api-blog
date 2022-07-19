import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { UniqueConstraintError } from '../types/UniqueConstraintError';
import { handleDatabaseErrors } from '../utils/handleDatabaseErrors';
import { isPrismaError } from '../utils/isPrismaError';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                if (isPrismaError(err)) {
                    err = handleDatabaseErrors(err);
                }
                if (err instanceof UniqueConstraintError) {
                    throw new BadRequestException(err.message);
                } else {
                    throw err;
                }
            }),
        );
    }
}
