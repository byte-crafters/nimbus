import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { AppServiceModule } from '@modules/app-service/app-service.module';

@Module({
    imports: [
        AuthModule,
        AppServiceModule,
    ],
})
export class AppModule { }
