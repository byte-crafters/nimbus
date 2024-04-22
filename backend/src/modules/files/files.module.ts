import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { UsersModule } from '../user/users.module';
import { FileService } from './file.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '../config/config.module';
import { FileAccessRepository } from './file-access.service';

@Module({
    imports: [AuthModule, UsersModule, FilesStructureModule, FilesSystemModule, ConfigModule],
    controllers: [FilesController],
    providers: [FileService, FileAccessRepository],
    exports: [FileService, FileAccessRepository],
})
export class FilesModule {}
