import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppServiceModule } from '../app-service/app-service.module';
import { jwtConstants } from '@modules/auth/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        AuthModule,
        AppServiceModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        })
    ],
})
export class AppModule { }
