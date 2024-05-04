import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileStructureRepository } from './file-structure.service';
import { AccessRepository } from '../files/access.repository';
import { PostgresConnection } from '../storage/postgres-connection';

@Module({
    providers: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: FileStructureRepository,
        },

        AccessRepository,
        PostgresConnection
    ],
    exports: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: FileStructureRepository,
        },
        AccessRepository,
        PostgresConnection
    ],
})
export class FilesStructureModule {}
