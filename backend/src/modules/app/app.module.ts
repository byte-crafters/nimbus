import { AppServiceModule } from '@modules/app-service/app-service.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../user/users.module';
import { ConfigModule } from '../config/config.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        AuthModule,
        AppServiceModule,
        FilesModule,
        FilesSystemModule,
        FilesStructureModule,
        UsersModule,
        ConfigModule,
        StorageModule
    ],
})
export class AppModule {}
