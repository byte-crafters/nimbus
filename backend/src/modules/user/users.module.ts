import { Module } from '@nestjs/common';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { UsersController } from './controllers/users.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        StorageModule
    ],
    providers: [userServiceDefaultProvider],
    controllers: [UsersController],
    exports: [userServiceDefaultProvider],
})
export class UsersModule {}
