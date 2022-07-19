import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './repositories/posts.repository';

@Injectable()
export class PostsService {
    constructor(private readonly repository: PostsRepository) {}

    create(createPostDto: CreatePostDto, id: number) {
        const data: Prisma.PostCreateInput = {
            ...createPostDto,
            author: {
                connect: {
                    id,
                },
            },
        };

        return this.repository.create(data);
    }

    findAll(queryFilter?: QueryFilterDto) {
        const { takeposts, skipposts } = queryFilter;

        return this.repository.findAll(+takeposts, +skipposts);
    }

    async findOne(id: number) {
        const post = await this.repository.findOne(id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        try {
            return this.repository.update(id, updatePostDto);
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async remove(id: number) {
        try {
            await this.repository.remove(id);

            return { success: true };
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
