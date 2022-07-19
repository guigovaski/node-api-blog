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
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersGuard } from 'src/auth/guards/users.guard';
import { QueryFilterDto } from './dto/query-filter.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/payload/jwt.payload';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiBadRequestResponse({
        description: 'Minimum password size is 8 characters',
    })
    @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(@Query() queryFilter?: QueryFilterDto) {
        return this.usersService.findAll(queryFilter);
    }

    @ApiBearerAuth()
    @ApiNotFoundResponse({ description: 'User not found' })
    @UseGuards(AuthGuard('jwt'), UsersGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @ApiBearerAuth()
    @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    @UseGuards(AuthGuard('jwt'), UsersGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @ApiBearerAuth()
    @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
    @UseGuards(AuthGuard('jwt'), UsersGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @Post('signin')
    signin(@Body() signinDto: SigninDto) {
        return this.usersService.signin(signinDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('signout')
    signout(@Req() req: Request) {
        const { userId: id } = req.user as JwtPayload;
        return this.usersService.signout(+id);
    }
}
