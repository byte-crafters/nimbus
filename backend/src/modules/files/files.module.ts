import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { UsersModule } from '../user/users.module';
import { FileService } from './file.service';
import { FilesController } from './files.controller';

@Module({
    imports: [AuthModule, UsersModule, FilesStructureModule, FilesSystemModule],
    controllers: [FilesController],
    providers: [FileService],
    exports: [FileService],
})
export class FilesModule {}
