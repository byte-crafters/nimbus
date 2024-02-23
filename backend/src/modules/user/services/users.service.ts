import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';
// import { PrismaClient as PostgresClient } from '../../../../prisma/generated/prisma-postgres-client-js';
import { PrismaClient as PostgresClient } from '@prsm/generated/prisma-postgres-client-js';
import { CreateUserDTO } from './mock.users.service';
import { v4 as uuidv4 } from 'uuid';

export interface IUserService {
    findOne(username: string): Promise<User | undefined>;
    findAll(): Promise<User[] | null>;
    createOne({ password, username }: CreateUserDTO): Promise<any>;
    getUserProfile(userId: string): Promise<any>;
}

@Injectable()
export class UsersService implements IUserService {
    async findOne(username: string): Promise<User | undefined> {
        const postgresClient = new PostgresClient();

        const user = await postgresClient.user.findUnique({
            where: {
                username
            }
        });

        return user;
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }

    async createOne({ password, username }: CreateUserDTO): Promise<any> {
        const postgresClient = new PostgresClient();


        const user = {
            email: Date.now() + '@nimbus.dev',
            username,
            password
        };

        const db_user = await postgresClient.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: user.password,
                id: uuidv4()
            },
        });

        return db_user;
    }

    async getUserProfile(userId: string): Promise<any> {
        // const user = mockUsersCollection.find((user) => user.id.toString() === userId);
        const postgresClient = new PostgresClient();

        const user = await postgresClient.user.findUnique({
            where: {
                id: userId
            }
        });

        return user;
    }
}
