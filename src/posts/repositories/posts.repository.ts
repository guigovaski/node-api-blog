import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.PostCreateInput) {
        return this.prisma.post.create({
            data,
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(takePosts: number, skipPosts: number) {
        return this.prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
            take: takePosts || undefined,
            skip: skipPosts || undefined,
        });
    }

    async findOne(id: number) {
        return this.prisma.post.findUnique({
            where: { id },
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        return this.prisma.post.update({
            data: updatePostDto,
            where: { id },
        });
    }

    async remove(id: number) {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}
