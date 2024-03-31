import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileStructureService } from './file-structure.service';

@Module({
    providers: [
        FileStructureService
    ],
    exports: [
        FileStructureService
    ]
})
export class FilesStructureModule { }