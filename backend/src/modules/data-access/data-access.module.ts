import { Module } from '@nestjs/common';
import { TYPES } from '@src/dependencies/di';
import { UserRepository } from './services/user.repository';

@Module({
    providers: [{
        provide: TYPES.USER_REPOSITORY,
        useClass: UserRepository
    }],
    exports: [{
        provide: TYPES.USER_REPOSITORY,
        useClass: UserRepository
    }]
})
export class DataAccessModule {}
