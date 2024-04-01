import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { TYPES } from '@src/dependencies/providers';
import { Response } from 'express';
import { Public } from '../services/auth.decorator';
import { AuthGuard } from '../services/auth.guard';
import { IAuthService } from '../services/auth.service';
import { UserRegisterError } from '@src/modules/errors/ErrorUserRegister';
import { UserRegisterEdnpointError } from '@src/modules/errors/ErrorUserRegisterEndpoint';
import { GenericServerError } from '@src/modules/errors/logic/GenericServerError';

export type SignInDto = {
    username: string;
    password: string;
};

export type RegisterDTO = {
    username: string;
    password: string;
};

export interface IAuthController {
    signIn(signInDto: SignInDto, response: Response): Promise<Response>;
    register(registerDTO: RegisterDTO, response: Response): Promise<Response>;
    getSelfProfile(req: any, response: Response): Promise<Response>;
}

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController implements IAuthController {
    constructor(
        @Inject(TYPES.AUTH_SERVICE) private authService: IAuthService,
    ) {}

    @Public()
    @Post('login')
    async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
        const accessToken = await this.authService.signIn(
            signInDto.username,
            signInDto.password,
        );
        response.cookie('access_token', accessToken.access_token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        return response.send(accessToken);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getSelfProfile(@Req() req: any, @Res() response: Response) {
        const { user: userProfile, rootFolder } =
            await this.authService.getProfile(req.user.sub);
        return response.send({ ...userProfile, rootFolder });
    }

    @Public()
    @Post('register')
    async register(
        @Body() registerDTO: RegisterDTO,
        @Res() response: Response,
    ) {
        try {
            const accessToken = await this.authService.register(
                registerDTO.username,
                registerDTO.password,
            );
            response.cookie('access_token', accessToken.access_token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            return response.send(accessToken);
        } catch (e: unknown) {
            console.log(e);
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
