import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

export type SignInDto = {
    username: string;
    password: string;
};

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Get('register')
    register(): string {
        return 'register';
    }
}
