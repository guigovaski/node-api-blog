import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async findPost(id: number) {
        return this.prisma.post.findUnique({
            where: { id },
            select: {
                authorId: true,
            },
        });
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const { id } = request.params;
        const { userId } = request.user;

        const authorValidate = async () => {
            const authorId = await this.findPost(+id)
                .then((res) => res.authorId)
                .catch((error) => null);

            if (authorId && +authorId === +userId) {
                return true;
            } else {
                throw new UnauthorizedException('Unauthorized');
            }
        };

        return authorValidate();
    }
}
