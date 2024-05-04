import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../user/users.module';
import { FilesController } from './controllers/files.controller';
import { LoadController } from './controllers/load.controller';
import { ShareController } from './controllers/share.controller';
import { AccessRepository } from './services/access.repository';
import { AccessService } from './services/access.service';
import { FileService } from './services/file.service';
import { RemoveController } from './controllers/remove.controller';

@Module({
    imports: [AuthModule, UsersModule, FilesStructureModule, FilesSystemModule, ConfigModule, StorageModule],
    controllers: [FilesController, ShareController, LoadController, RemoveController],
    providers: [FileService, AccessRepository, AccessService],
    exports: [FileService, AccessRepository, AccessService],
})
export class FilesModule { }
