import { IUserService, UsersService } from '@modules/user/services/users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TYPES } from '@src/dependencies/providers';

export interface IAuthService {
    register(username: string, password: string): Promise<any>;
    signIn(username: string, pass: string): Promise<any>;
    getProfile(userId: string): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,
        private jwtService: JwtService
    ) { }

    async register(username: string, password: string): Promise<any> {
        // throw new Error('Method not implemented.');
        const user = await this.usersService.createOne({ password, username });
        // return user;

        const payload = {
            sub: user.id,
            username: user.username
        };

        const result = {
            access_token: await this.jwtService.signAsync(payload)
        };

        return result;
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

    async getProfile(userId: string): Promise<any> {
        const user = await this.usersService.getUserProfile(userId);
        return user;
    }
}