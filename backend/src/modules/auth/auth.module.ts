import { Module } from '@nestjs/common';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService, AUTH_SERVICE } from '@modules/auth/auth.service';
import { UsersModule } from '@modules/users/users.module';
import { jwtConstants } from '@modules/auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: AUTH_SERVICE,
            useClass: AuthService
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
})
export class AuthModule { }
