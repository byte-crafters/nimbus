import { UsersService } from '@modules/user/services/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface IAuthService {
    register(username: string, password: string): Promise<any>;
    signIn(username: string, pass: string): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(username: string, password: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username };

        const result = {
            access_token: await this.jwtService.signAsync(payload),
        };

        return result;
    }
}