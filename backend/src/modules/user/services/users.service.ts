import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';

export const mockUsersCollection = [
    new User({ password: '123', username: 'one' }),
    new User({ password: 'qwe', username: 'two' })
];

@Injectable()
export class UsersService {
    async findOne(username: string): Promise<User | undefined> {
        return mockUsersCollection.find((user) => user.username === username);
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }
}
