import { Injectable } from '@nestjs/common';
import { DBUserId } from '../entities/user.entities';
import { MethodNotImplemented } from '../errors/not-implemented.error';
import { IUsersRepository } from './user.repository';

@Injectable()
export class MockUserRepository implements IUsersRepository {
    create(): Promise<any> {
        throw new MethodNotImplemented();
    }

    findOneByUsername(username: string): Promise<any> {
        throw new MethodNotImplemented();
    }

    findOneById(id: DBUserId): Promise<any> {
        throw new MethodNotImplemented();
    }

    findAll(): Promise<any> {
        throw new MethodNotImplemented();
    }
}
