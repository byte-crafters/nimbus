import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './services/auth.guard';
import { authServiceDefaultProvider } from '@src/dependencies/providers';
import { AuthController } from './controllers/auth.controller';
import { jwtConstants } from './services/constants';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [
        UsersModule,
        FilesModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '3600s' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        authServiceDefaultProvider,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
})
export class AuthModule { }
