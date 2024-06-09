import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';
import { TFolderId } from '@src/modules/file-structure/file-structure.type';

export const mockUsersCollection = [
    new User({ password: '123', username: 'one', email: Date.now().toString() }),
    new User({ password: 'qwe', username: 'two', email: Date.now().toString() }),
];

export type CreateUserDTO = {
    password: string;
    username: string;
    email: string;
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
        /** TODO fix email */
        const user = new User({ password, username, email: Date.now().toString() });
        mockUsersCollection.push(user);
        return user;
    }

    async getUserProfile(userId: string) {
        const user = mockUsersCollection.find((user) => user.id.toString() === userId);
        return user;
    }
}
