import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: Symbol.for('IFileSystemService'),
            useClass: FileSystemService,
        },
    ],
    exports: [
        {
            provide: Symbol.for('IFileSystemService'),
            useClass: FileSystemService,
        },
    ],
})
export class FilesSystemModule {}
