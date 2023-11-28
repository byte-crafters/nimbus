import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { TYPES } from '@src/dependencies/di';
import { IAuthService } from '../services/auth.service';
import { Public } from '../services/auth.decorator';
import { AuthGuard } from '../services/auth.guard';

export type SignInDto = {
    username: string;
    password: string;
};

export interface IAuthController {
    signIn(signInDto: SignInDto): Promise<string>;
    getProfile(req: any): Promise<string>;
    register(): Promise<string>
}

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController implements IAuthController {
    constructor(
        @Inject(TYPES.AUTH_SERVICE) private authService: IAuthService
    ) { }

    @Public()
    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        return req.user;
    }

    @Public()
    @Get('register')
    async register() {
        return 'register';
    }
}
