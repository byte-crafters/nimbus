import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { AppServiceModule } from '@modules/app-service/app-service.module';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [
        AuthModule,
        AppServiceModule,
        FilesModule
    ],
})
export class AppModule { }
