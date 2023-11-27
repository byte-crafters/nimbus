import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { AUTH_SERVICE, IAuthService } from '@modules/auth/auth.service';
import { Public } from '@modules/auth/auth.decorator';

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
        @Inject(AUTH_SERVICE) private authService: IAuthService
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
