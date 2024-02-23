import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileStructureService } from './file-structure.service';

@Module({
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
