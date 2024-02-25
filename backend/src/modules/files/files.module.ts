import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileStructureService } from './file-structure.service';
import { FilesController } from './files.controller';

@Module({
    controllers: [FilesController],
    providers: [
        FileSystemService,
        FileStructureService
    ],
    exports: [
        FileSystemService,
        FileStructureService
    ]
})
export class FilesModule { }
