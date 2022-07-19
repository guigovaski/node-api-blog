import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export function verifyCredentials(password: string, userPassword: string) {
    const match = bcrypt.compareSync(password, userPassword);

    if (!match) {
        throw new UnauthorizedException('Invalid credentials');
    }
}
