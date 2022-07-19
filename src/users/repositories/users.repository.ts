import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { verifyCredentials } from '../utils/verifyCredentials.util';

@Injectable()
export class UsersRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async create(data: Prisma.UserCreateInput, jwtId: string) {
        const user = await this.prisma.user.create({
            data,
        });

        const jwtToken = await this.authService.createAcessToken({
            email: user.email,
            userId: user.id,
            id: jwtId,
        });

        await this.prisma.token.create({
            data: {
                id: jwtId,
                token: jwtToken,
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        return {
            name: user.name,
            email: user.email,
            jwtToken,
        };
    }

    async findAll(
        takePosts: number,
        skipPosts: number,
        takeUsers: number,
        skipUsers: number,
    ) {
        return this.prisma.user.findMany({
            select: {
                name: true,
                posts: {
                    select: {
                        title: true,
                        content: true,
                    },
                    take: takePosts || undefined,
                    skip: skipPosts || undefined,
                },
            },
            take: takeUsers || undefined,
            skip: skipUsers || undefined,
        });
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                posts: true,
            },
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
    }

    async remove(id: number) {
        const post = await this.prisma.post.findFirst({
            where: {
                authorId: {
                    equals: id,
                },
            },
        });

        if (post) {
            await this.prisma.post.deleteMany({
                where: {
                    authorId: {
                        equals: id,
                    },
                },
            });
        }

        return this.prisma.$transaction([
            this.prisma.token.delete({
                where: { userId: id },
            }),
            this.prisma.user.delete({
                where: { id },
            }),
        ]);
    }

    async signin(email: string, password: string, jwtId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        // generates an error if the credentials are invalid
        verifyCredentials(password, user.password);

        const jwtToken = await this.authService.createAcessToken({
            email: user.email,
            userId: user.id,
            id: jwtId,
        });

        try {
            await this.prisma.token.delete({
                where: {
                    userId: user.id,
                },
            });
        } finally {
            await this.prisma.token.create({
                data: {
                    id: jwtId,
                    token: jwtToken,
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                jwtToken,
            };
        }
    }

    async signout(id: number) {
        const token = await this.prisma.token.findUnique({
            where: { userId: id },
        });

        if (token) {
            await this.prisma.token.delete({
                where: { userId: id },
            });
        }

        return { success: true };
    }
}
