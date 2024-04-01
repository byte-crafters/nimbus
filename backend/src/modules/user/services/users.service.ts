import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';
import { PrismaClient as PostgresClient, Prisma } from '@prsm/generated/prisma-postgres-client-js';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDTO } from './mock.users.service';
import { DbUserUniqueConstraintError } from '@src/modules/errors/ErrorUniqueConstaint';

export interface IUserService {
    findOne(username: string): Promise<User | undefined>;
    findAll(): Promise<User[] | null>;
    createOne({ password, username }: CreateUserDTO): Promise<TCreateUserResult>;
    getUserProfile(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
    }>;
}

export type TCreateUserResult = {
    id: string;
    email: string;
    username: string;
    password: string;
};

@Injectable()
export class UsersService implements IUserService {
    async findOne(username: string): Promise<User | undefined> {
        const postgresClient = new PostgresClient();

        const user = await postgresClient.user.findUnique({
            where: {
                username,
            },
        });

        return user;
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }

    async createOne({ password, username }: CreateUserDTO): Promise<TCreateUserResult> {
        try {
            const postgresClient = new PostgresClient();

            const user = {
                email: Date.now() + '@nimbus.dev',
                username,
                password,
            };

            const db_user = await postgresClient.user.create({
                data: {
                    email: user.email,
                    username: user.username,
                    password: user.password,
                    id: uuidv4(),
                },
            });

            return db_user;
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new DbUserUniqueConstraintError('username');
                }
            }

            throw e;
        }
    }

    async getUserProfile(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        password: string;
    }> {
        // const user = mockUsersCollection.find((user) => user.id.toString() === userId);
        const postgresClient = new PostgresClient();

        const user = await postgresClient.user.findUnique({
            where: {
                id: userId,
            },
        });

        return user;
    }
}
