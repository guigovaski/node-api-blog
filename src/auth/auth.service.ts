import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './payload/jwt.payload';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async createAcessToken(jwtPayload: JwtPayload) {
        return this.jwtService.sign(jwtPayload, {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '1d',
        });
    }

    async validateUser(jwtPayload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: jwtPayload.userId },
        });

        const jwtToken = await this.prisma.token.findUnique({
            where: {
                userId: jwtPayload.userId,
            },
        });

        if (!user || !jwtToken || jwtPayload.id !== jwtToken.id) {
            throw new UnauthorizedException('Unauthorized');
        }

        return {
            userId: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
