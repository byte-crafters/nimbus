import { Inject, Injectable } from '@nestjs/common';
import { TFileId } from '../file-structure/file-structure.type';
import { PostgresConnection } from '../storage/postgres-connection';
import { TRights } from './file.type';

@Injectable()
export class FileAccessRepository {
    // private connection: PostgresClient;

    constructor(
        @Inject(PostgresConnection) private connection: PostgresConnection
    ) {
        // this.connection = new PostgresConnection();
    }

    async create(rights: TRights, userId: string, fileId: TFileId) {
        // const foundUser = this.connection.user.findUnique({
        //     where: {
        //         id: userId
        //     }
        // })
        try {

            return await this.connection.fileAccess.create({
                data: {
                    userRights: rights,
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    file: {
                        connect: {
                            id: fileId
                        }
                    },

                }
            });

        } catch (e: unknown) {
            console.error(e)
        }
    }
}
