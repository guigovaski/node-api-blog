import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { SigninDto } from './dto/signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        try {
            if (createUserDto.password.length < 6) {
                throw new BadRequestException(
                    'Minimum password size is 8 characters',
                );
            }

            const passwordHash = await bcrypt.hash(createUserDto.password, 10);
            const jwtId = uuidv4();

            const data: Prisma.UserCreateInput = {
                ...createUserDto,
                password: passwordHash,
            };

            return this.repository.create(data, jwtId);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Something went wrong');
            }
        }
    }

    findAll(queryFilter?: QueryFilterDto) {
        const { takeposts, skipposts, takeusers, skipusers } = queryFilter;

        return this.repository.findAll(
            +takeposts,
            +skipposts,
            +takeusers,
            +skipusers,
        );
    }

    async findOne(id: number) {
        const user = await this.repository.findOne(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const data: Prisma.UserUpdateInput = {
                ...updateUserDto,
            };

            return this.repository.update(id, data);
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

    async signin(signinDto: SigninDto) {
        const jwtId = uuidv4();

        return this.repository.signin(
            signinDto.email,
            signinDto.password,
            jwtId,
        );
    }

    signout(id: number) {
        return this.repository.signout(id);
    }
}
