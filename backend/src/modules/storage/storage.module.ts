import { Module } from '@nestjs/common';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { PostgresConnection } from './postgres-connection';

@Module({
    providers: [PostgresConnection],
    exports: [PostgresConnection],
})
export class StorageModule { }
