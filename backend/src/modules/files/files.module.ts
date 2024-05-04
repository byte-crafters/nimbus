import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { UsersModule } from '../user/users.module';
import { FileService } from './file.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '../config/config.module';
import { AccessRepository } from './access.repository';
import { AccessService } from './access.service';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [AuthModule, UsersModule, FilesStructureModule, FilesSystemModule, ConfigModule, StorageModule],
    controllers: [FilesController],
    providers: [FileService, AccessRepository, AccessService],
    exports: [FileService, AccessRepository, AccessService],
})
export class FilesModule {}
