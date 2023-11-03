import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './decorator';

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

    @Public()
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Public()
    @Get('register')
    register(): string {
        return 'register';
    }
}
