import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileStructureRepository } from './file-structure.service';
import { MongoConnection } from './mongo-connection';

@Module({
    providers: [FileStructureRepository],
    exports: [FileStructureRepository],
})
export class FilesStructureModule {}
