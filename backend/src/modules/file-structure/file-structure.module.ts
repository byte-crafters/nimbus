import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DataRepository } from './data.repository';
import { AccessRepository } from '../files/services/access.repository';
import { PostgresConnection } from '../storage/postgres-connection';

@Module({
    providers: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: DataRepository,
        },

        AccessRepository,
        PostgresConnection
    ],
    exports: [
        {
            provide: Symbol.for('IFileStructureRepository'),
            useClass: DataRepository,
        },
        AccessRepository,
        PostgresConnection
    ],
})
export class FilesStructureModule {}
