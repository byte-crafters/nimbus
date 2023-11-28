import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { mockUsersCollection } from './users.mock-service';

export interface IUserService {
    create(username: string, password: string): Promise<User>;
    findOne(username: string): Promise<User | undefined>;
    findAll(): Promise<User[] | null>
}

@Injectable()
export class UsersService implements IUserService {
    async create(username: string, password: string) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = new User({ username, password: hashedPassword });
        mockUsersCollection.push(user);
        return user;
    }

    async findOne(username: string): Promise<User | undefined> {
        return mockUsersCollection.find((user) => user.username === username);
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }
}