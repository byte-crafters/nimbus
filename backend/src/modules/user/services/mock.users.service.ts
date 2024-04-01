import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';

export const mockUsersCollection = [
    new User({ password: '123', username: 'one' }),
    new User({ password: 'qwe', username: 'two' }),
];

export type CreateUserDTO = {
    password: string;
    username: string;
};

@Injectable()
export class MockUsersService {
    async findOne(username: string): Promise<User | undefined> {
        return mockUsersCollection.find((user) => user.username === username);
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }

    async createOne({ password, username }: CreateUserDTO) {
        const user = new User({ password, username });
        mockUsersCollection.push(user);
        return user;
    }

    async getUserProfile(userId: string) {
        const user = mockUsersCollection.find((user) => user.id.toString() === userId);
        return user;
    }
}
