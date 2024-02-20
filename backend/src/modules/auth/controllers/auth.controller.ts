import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TYPES } from '@src/dependencies/providers';
import { IAuthService } from '../services/auth.service';
import { Public } from '../services/auth.decorator';
import { AuthGuard } from '../services/auth.guard';
import { Response } from 'express';

export type SignInDto = {
    username: string;
    password: string;
};

export interface IAuthController {
    signIn(signInDto: SignInDto, response: Response): Promise<Response>;
    getProfile(req: any): Promise<string>;
    register(): Promise<string>;
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
    async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
        const accessToken = await this.authService.signIn(signInDto.username, signInDto.password);
        response.cookie('access_token', accessToken.access_token, {
            httpOnly: true
        });
        return response.send(accessToken);
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
