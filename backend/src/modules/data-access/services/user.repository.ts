import { Injectable } from '@nestjs/common';
import { DBUserId } from '../entities/user.entities';
import { MethodNotImplemented } from '../errors/not-implemented.error';

export interface IUsersRepository {
    create(): Promise<any>;
    findOneByUsername(username: string): Promise<any>;
    findOneById(id: DBUserId): Promise<any>;
    findAll(): Promise<any>;
}

@Injectable()
export class UserRepository implements IUsersRepository {
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
