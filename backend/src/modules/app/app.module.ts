import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppServiceModule } from '../app-service/app-service.module';

@Module({
    imports: [
        AuthModule,
        AppServiceModule,
    ],
})
export class AppModule { }
