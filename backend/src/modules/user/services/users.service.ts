import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '../models/User';
import { PrismaClient as PostgresClient, Prisma } from '@prsm/generated/prisma-postgres-client-js';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDTO } from './mock.users.service';
import { DbUserUniqueConstraintError } from '@src/modules/errors/ErrorUniqueConstaint';
import { PostgresConnection } from '@src/modules/storage/postgres-connection';
import { TFolder } from '@src/modules/file-structure/file-structure.type';
import { DbConnectionException } from '@src/modules/errors/db/DbConnectionException';

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
    getUsersByUsername(username: string): Promise<any>;
}

export type TCreateUserResult = {
    id: string;
    email: string;
    username: string;
    password: string;
    rootFolder: TFolder;
};

@Injectable()
export class UsersRepository implements IUserService {
    // private connection: PostgresClient;

    constructor(
        @Inject(PostgresConnection) private connection: PostgresConnection
    ) {
        // this.connection = new PostgresConnection();
    }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.connection.user.findUnique({
            where: {
                username,
            },
        });

        return user;
    }

    async findAll(): Promise<User[] | null> {
        throw new NotImplementedException();
    }

    /**
     * Returns with rootFolder
     */
    async createOne({ password, username }: CreateUserDTO): Promise<TCreateUserResult> {
        try {
            // const postgresClient = new PostgresClient();

            const user = {
                email: Date.now() + '@nimbus.dev',
                username,
                password,
            };

            // const client = new PostgresClient()

            // console.error(this.connection)

            // const rootf = await this.connection.folder.create({
            //     data: {}
            // })

            const db_user = await this.connection.user.create({
                data: {
                    email: user.email,
                    username: user.username,
                    password: user.password,
                    id: uuidv4(),
                    rootFolder: {
                        create: {}
                    }
                },
                include: {
                    rootFolder: true,
                },
                // select: {
                //     email: true,
                //     password: true,
                //     rootFolder: true,
                //     username: true,
                //     id: true
                // }
            });



            const fs = await this.connection.folder.update({
                // where: {
                //     rootUserOwner: {
                //         id: db_user.id
                //     }
                // }, 
                where: {
                    id: db_user.rootFolderId,
                },
                data: {
                    owner: {
                        connect: {
                            id: db_user.id
                        }
                    }
                }
            });

            return db_user as any;
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new DbUserUniqueConstraintError('username');
                }
            } else if (e instanceof Prisma.PrismaClientInitializationError) {
                throw new DbConnectionException();
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

    async getUsersByUsername(username: string) {
        const result = await this.connection.user.findMany({
            where: {
                username: {
                    contains: username
                }
            },
            select: {
                username: true,
                id: true
            }
        });

        return result;
    }


}
