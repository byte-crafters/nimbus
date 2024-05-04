import { Inject, Injectable } from '@nestjs/common';
import { TFileId, TFolder, TFolderId } from '../../file-structure/file-structure.type';
import { PostgresConnection } from '../../storage/postgres-connection';
import { TRights } from '../file.type';
import { Prisma } from '@prsm/generated/prisma-postgres-client-js';
import { FILE_VIEW, FOLDER_VIEW } from './access.service';

@Injectable()
export class AccessRepository {
    // private connection: PostgresClient;

    constructor(
        @Inject(PostgresConnection) private connection: PostgresConnection
    ) {
        // this.connection = new PostgresConnection();
    }

    async getAccessForFolder(folderId: string, userId: string) {
        const result = await this.connection.folderAccess.findFirst({
            where: {
                folderId,
                userId
            }
        });

        return result;
    }

    async getAccessForFile(fileId: string, userId: string) {
        const result = await this.connection.fileAccess.findFirst({
            where: {
                fileId,
                userId
            }
        });

        return result;
    }

    async getFilesSharedWithUser(
        userId: string
    ) {
        const result = await this.connection.file.findMany({
            where: {
                fileAccess: {
                    every: {
                        userId: userId
                    }
                },
            },
            include: {
                fileAccess: {
                    where: {
                        userId: userId,
                        userRights: {
                            gte: 1
                        }
                    }
                }
            }
        });

        return result;
    }

    async getFoldersSharedWithUser(
        userId: string
    ) {
        const result = await this.connection.folder.findMany({
            where: {
                folderAccess: {
                    every: {
                        userId: userId,
                    }
                },
            },
            include: {
                folderAccess: {
                    where: {
                        userId: userId,
                        userRights: {
                            gte: 1
                        }
                    }
                }
            }
        });

        return result;
    }

    async getFileShares(fileId: TFileId) {
        const result = await this.connection.fileAccess.findMany({
            where: {
                fileId
            }
        });

        return result;
    }

    async getFolderShares(folderId: TFolderId) {
        const result = await this.connection.folderAccess.findMany({
            where: {
                folderId
            }
        });

        return result;
    }

    async removeFileAccess(userId: string, fileId: TFileId) {
        const result = await this.connection.fileAccess.delete({
            where: {
                fileId_userId: {
                    fileId,
                    userId
                }
            }
        });

        return result;
    }

    async removeFolderAccess(userId: string, folderId: TFolderId) {
        try {
            const result = await this.connection.folderAccess.delete({
                where: {
                    folderId_userId: {
                        folderId,
                        userId
                    }
                }
            });

            return result;
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    /** We do nothing if such records doesn't exist. It's ok */
                    return;
                }
            }

            console.error(e);
            throw e;
        }

    }

    /** TODO
     * move into another repository
     */
    async getFileOwner(fileId: TFileId) {
        // return this.connection.user.findFirst({
        //     where: {
        //         File: {
        //             some: {
        //                 id: fileId
        //             }
        //         }
        //     }
        // })
        const result = await this.connection.file.findFirst({
            where: {
                id: fileId
            },
            select: {
                owner: true
            }
        });

        return result.owner;
    }

    /** TODO
     * move into another repository
     */
    async getFolderOwner(folderId: TFolderId) {
        const result = await this.connection.folder.findFirst({
            where: {
                id: folderId
            },
            select: {
                // rootUserOwner: true
                owner: true
            }
        });

        return result.owner;
    }

    async setFileAccess(rights: TRights, userId: string, fileId: TFileId) {
        try {
            const result = await this.connection.fileAccess.upsert({
                create: {
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
                },
                update: {
                    userRights: rights
                },
                where: {
                    fileId_userId: {
                        fileId,
                        userId
                    }
                }
            });

            return result;
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async setFolderAccess(rights: TRights, userId: string, folderId: TFileId) {
        try {
            return await this.connection.folderAccess.upsert({
                create: {
                    userRights: rights,
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    folder: {
                        connect: {
                            id: folderId
                        }
                    },
                },
                update: {
                    userRights: rights
                },
                where: {
                    folderId_userId: {
                        folderId,
                        userId
                    }
                }
            });

        } catch (e: unknown) {
            console.error(e);
        }
    }
}
