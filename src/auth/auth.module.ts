import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersGuard } from './guards/users.guard';
import { PostsGuard } from './guards/posts.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: '1d',
            },
        }),
    ],
    providers: [
        AuthService,
        PrismaService,
        JwtStrategy,
        UsersGuard,
        PostsGuard,
    ],
    exports: [AuthService, UsersGuard, PostsGuard],
})
export class AuthModule {}
