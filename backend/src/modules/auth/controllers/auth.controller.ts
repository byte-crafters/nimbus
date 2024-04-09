import { Body, Controller, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TYPES } from '@src/dependencies/providers';
import { UserRegisterError } from '@src/modules/errors/ErrorUserRegister';
import { GenericServerError } from '@src/modules/errors/logic/GenericServerError';
import { RegisterDTO, SignInDTO } from '@src/types/api/request';
import { Response } from 'express';
import { Public } from '../services/auth.decorator';
import { AuthGuard } from '../services/auth.guard';
import { IAuthService } from '../services/auth.service';

export interface IAuthController {
    signIn(signInDto: SignInDTO, response: Response): Promise<Response>;
    register(registerDTO: RegisterDTO, response: Response): Promise<Response>;
    getSelfProfile(req: any, response: Response): Promise<Response>;
}

export type TProfile = {
    email: string;
    id: string;
    password: string;
    username: string;
};

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController implements IAuthController {
    constructor(@Inject(TYPES.AUTH_SERVICE) private authService: IAuthService) {}

    @ApiTags('auth')
    @ApiOperation({
        summary: 'Log in user.',
        description: 'Log in user by cookie.',
    })
    @ApiResponse({
        status: 200,
        description: 'User has been successfully logged in.',
        headers: {
            ['Set-Cookie']: {
                description:
                    'JWT token. It needs for user identification and authorization. It lives for 24 hours and it is `HttpOnly`.',
                schema: {
                    type: 'string',
                },
            },
        },
    })
    @Public()
    @Post('login')
    async signIn(@Body() signInDTO: SignInDTO, @Res() response: Response) {
        const accessToken = await this.authService.signIn(signInDTO.username, signInDTO.password);
        response.cookie('access_token', accessToken.access_token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        return response.status(200).send(accessToken);
    }

    @ApiTags('auth')
    @ApiOperation({
        summary: 'Get user profile.',
        description: 'Get profile of user by cookie.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profile has been successfully found.',
    })
    @ApiCookieAuth('access_token')
    @UseGuards(AuthGuard)
    @Get('profile')
    async getSelfProfile(@Req() req: any, @Res() response: Response) {
        const { user: userProfile, rootFolder } = await this.authService.getProfile(req.user.sub);
        return response.send({ ...userProfile, rootFolder });
    }

    @ApiTags('auth')
    @ApiOperation({
        summary: 'Register user.',
        description: 'Create account for user.',
    })
    @ApiResponse({
        status: 200,
        description: 'User account has been successfully created.',
        headers: {
            ['Set-Cookie']: {
                description:
                    'JWT token. It needs for user identification and authorization. It lives for 24 hours and it is `HttpOnly`.',
                schema: {
                    type: 'string',
                },
            },
        },
    })
    @Public()
    @Post('register')
    async register(@Body() registerDTO: RegisterDTO, @Res() response: Response) {
        try {
            const accessToken = await this.authService.register(registerDTO.username, registerDTO.password);
            response.cookie('access_token', accessToken.access_token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            return response.send(accessToken);
        } catch (e: unknown) {
            if (e instanceof UserRegisterError) {
                response.status(HttpStatus.BAD_REQUEST).send(e.message);
            } else if (e instanceof GenericServerError) {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
            } else {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
            }
        }
    }
}
