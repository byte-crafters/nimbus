import { UsersModule } from '@modules/user/users.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { authServiceDefaultProvider } from '@src/dependencies/providers';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './services/auth.guard';
import { jwtConstants } from './services/constants';

@Module({
    imports: [
        UsersModule,
        FilesStructureModule,
        FilesSystemModule,
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
        },
    ],
    exports: [authServiceDefaultProvider],
})
export class AuthModule {}
