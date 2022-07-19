import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryFilterDto } from './dto/query-filter.dto';
import { PostsGuard } from 'src/auth/guards/posts.guard';
import { UsersGuard } from 'src/auth/guards/users.guard';
import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), UsersGuard)
    @Post(':id')
    create(@Param('id') id: string, @Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto, +id);
    }

    @Get()
    findAll(@Query() queryFilter?: QueryFilterDto) {
        return this.postsService.findAll(queryFilter);
    }

    @ApiNotFoundResponse({ description: 'Post not found' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(+id);
    }

    @ApiBearerAuth()
    @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    @UseGuards(AuthGuard('jwt'), PostsGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @ApiBearerAuth()
    @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    @UseGuards(AuthGuard('jwt'), PostsGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(+id);
    }
}
