import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileStructureRepository } from './file-structure.service';
import { FileAccessRepository } from '../files/file-access.service';
import { PostgresConnection } from '../storage/postgres-connection';

@Module({
    providers: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: FileStructureRepository,
        },

        FileAccessRepository,
        PostgresConnection
    ],
    exports: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: FileStructureRepository,
        },
        FileAccessRepository,
        PostgresConnection
    ],
})
export class FilesStructureModule {}
