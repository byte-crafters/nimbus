import { Module } from '@nestjs/common';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { UsersController } from './controllers/users.controller';

@Module({
    providers: [userServiceDefaultProvider],
    controllers: [UsersController],
    exports: [userServiceDefaultProvider]
})
export class UsersModule { }
