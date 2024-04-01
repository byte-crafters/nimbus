import { Module } from '@nestjs/common';
import { MockUsersService } from './services/mock.users.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { userServiceDefaultProvider } from '@src/dependencies/providers';

@Module({
    providers: [userServiceDefaultProvider],
    controllers: [UsersController],
    exports: [userServiceDefaultProvider],
})
export class UsersModule {}
