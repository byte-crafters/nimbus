import { Injectable } from '@nestjs/common';
import { Prisma } from '@prsm/generated/prisma-postgres-client-js';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
import { PostgresConnection } from '../storage/postgres-connection';
import { CreateUserRootFolderStructure, IDataRepository as IDataRepository, TFileId, TFileRepository, TFileStructureRemoveAllData, TFolder, TFolderId, TFolderRepository } from './file-structure.type';
import { createReadStream } from 'fs';


@Injectable()
export class DataRepository implements IDataRepository {
    private connection: PostgresConnection;

    constructor() {
        this.connection = new PostgresConnection();
    }

    async getClosestSharedFolder(folderId: string, userId: string, access: number = 1) {
        try {
            const requestedFolder = await this.connection.folder.findFirst({
                where: {
                    id: folderId
                },
                select: {
                    path: true
                }
            });

            const nearestSharedFolder = await this.connection.folder.findFirst({
                where: {
                    id: {
                        in: requestedFolder.path
                    },
                    folderAccess: {
                        some: {
                            userId: userId,
                            userRights: {
                                gte: access
                            }
                        }
                    },
                },
                include: {
                    folderAccess: true
                }
            });

            return nearestSharedFolder;
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getSharedWithMeFiles(userId: string) {
        try {
            const accs = await this.connection.fileAccess.findMany();

            return await this.connection.file.findMany({
                where: {
                    ownerId: {
                        not: {
                            equals: userId
                        }
                    },
                    fileAccess: {
                        some: {
                            userId: userId,
                            userRights: {
                                gt: 0
                            }
                        }
                    },
                },
                include: {
                    fileAccess: {
                        select: {
                            userRights: true
                        }
                    }
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getAllMySharedFiles(userId: string) {
        try {
            const accs = await this.connection.fileAccess.findMany();


            return await this.connection.file.findMany({
                where: {
                    ownerId: userId,
                    fileAccess: {
                        some: {
                            userId: {
                                not: userId
                            },
                            userRights: {
                                gt: 0
                            }
                        }
                    },
                },
                include: {
                    fileAccess: {
                        select: {
                            userRights: true
                        }
                    }
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getAllFilesOfUser(userId: string) {
        try {
            return this.connection.file.findMany({
                where: {
                    ownerId: userId
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }















    async getSharedWithMeFolders(userId: string) {
        try {
            const accs = await this.connection.folderAccess.findMany();

            return await this.connection.folder.findMany({
                where: {
                    owner: {
                        id: {
                            not: {
                                equals: userId
                            }
                        }
                    },
                    folderAccess: {
                        some: {
                            userId: userId,
                            userRights: {
                                gt: 0
                            }
                        }
                    },
                },
                include: {
                    folderAccess: {
                        select: {
                            userRights: true
                        }
                    }
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getAllMySharedFolders(userId: string) {
        try {
            const accs = await this.connection.folderAccess.findMany();


            return await this.connection.folder.findMany({
                where: {
                    owner: {
                        id: userId
                    },
                    folderAccess: {
                        some: {
                            userId: {
                                not: userId
                            },
                            userRights: {
                                gt: 0
                            }
                        }
                    },
                },
                include: {
                    folderAccess: {
                        select: {
                            userRights: true
                        }
                    }
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getAllFoldersOfUser(userId: string) {
        try {
            const allf = await this.connection.folder.findMany({
                include: { owner: true }
            });

            return this.connection.folder.findMany({
                where: {
                    owner: {
                        id: userId
                    }
                }
            });
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async removeAllData(): Promise<TFileStructureRemoveAllData[]> {
        /** 
         * Used only for tests.
         * Need to run sequentially to avoid `foreign key constaint violation` error.
        */

        await this.connection.fileAccess.deleteMany();
        await this.connection.folderAccess.deleteMany();

        const c4 = await this.connection.fileAccess.deleteMany();
        const c3 = await this.connection.user.deleteMany();
        const c1 = await this.connection.file.deleteMany();
        const c2 = await this.connection.folder.deleteMany();


        return [c1, c2];
    }

    async getFolderPath(folderId: TFolderId): Promise<Pick<TFolder, "id" | "name">[]> {
        try {
            const folder = await this.getFolderById(folderId);
            if (folder === null) {
                throw new NoFolderWithThisIdError(`No folder with id ${folderId}.`);
            }

            console.log(folder);
            const ancestorFoldersIds = folder.path.slice(1);
            console.log(ancestorFoldersIds);

            const names = await this.connection.folder.findMany({
                where: {
                    id: {
                        in: ancestorFoldersIds,
                    },
                },
                select: {
                    name: true,
                    id: true,
                },
            });

            const result = names.map((folder) => {
                return {
                    name: folder.name,
                    id: folder.id,
                };
            });

            /** Add this folder name to make path include this folder. */
            result.push({
                name: folder.name,
                id: folder.id,
            });
            return result;
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                }
                if (e.code === 'P2023') {
                    /** 'Malformed ObjectID: invalid character '-' */
                    throw e;
                }
            }
            if (e instanceof NoFolderWithThisIdError) {
                throw e;
            }

            throw e;
        }
    }

    async getChildrenFiles(folderId: TFolderId): Promise<TFileRepository[]> {
        return this.connection.file.findMany({
            where: {
                folderId,
            },
        });
    }

    async createFile(name: string, extension: string, folderId: TFolderId, userId: string, size: number): Promise<TFileRepository> {
        try {
            return this.connection.file.create({
                data: {
                    extension,
                    // folderId,
                    size,
                    name,
                    owner: {
                        connect: {
                            id: userId
                        }
                    },
                    folder: {
                        connect: {
                            id: folderId
                        },
                    }
                },
            });
        } catch (e: unknown) {
            console.error(e);
        }
    }

    async getFileById(fileId: TFileId): Promise<TFileRepository> {
        try {
            return this.connection.file.findUnique({
                where: {
                    id: fileId,
                },
            });
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                }
            }

            throw e;
        }
    }

    async getRemovedFiles(userId: string) {
        try {
            const result = await this.connection.file.findMany({
                where: {
                    removed: true,
                    owner: {
                        id: userId
                    }
                }
            });

            return result;
        } catch (e: unknown) {
            throw e;
        }
    }

    async getRemovedFolders(userId: string) {
        try {
            const result = await this.connection.folder.findMany({
                where: {
                    removed: true,
                    owner: {
                        id: userId
                    }
                }
            });

            return result;
        } catch (e: unknown) {
            throw e;
        }
    }

    async removeFile(fileId: TFileId, softDelete: boolean): Promise<Pick<TFileRepository, 'folderId' | 'id'>> {
        try {
            if (softDelete) {
                return await this.connection.file.update({
                    where: {
                        id: fileId,
                    },
                    data: {
                        removed: true,
                    },
                    select: {
                        folderId: true,
                        id: true
                    }
                });
            } else {
                return await this.connection.file.delete({
                    where: {
                        id: fileId,
                    },
                    select: {
                        folderId: true,
                        id: true,
                    },
                });
            }
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                } else if (e.code === 'P2023') {
                    /** TODO: add another exception class here. */
                    /** Incorrect id format */
                    throw new DbFileRecordDoesNotExist();
                }
            }

            throw e;
        }
    }

    async removeFolder(folderId: TFileId, softDelete: boolean): Promise<any> {
        try {
            if (softDelete) {
                return await this.connection.folder.update({
                    where: {
                        id: folderId,
                    },
                    data: {
                        removed: true,
                    },
                    select: {
                        id: true
                    }
                });
            } else {
                return await this.connection.folder.delete({
                    where: {
                        id: folderId,
                    },
                    select: {
                        id: true,
                    },
                });
            }
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                } else if (e.code === 'P2023') {
                    /** TODO: add another exception class here. */
                    /** Incorrect id format */
                    throw new DbFileRecordDoesNotExist();
                }
            }

            throw e;
        }
    }
    async recoverFile(fileId: TFileId, userId: string): Promise<Pick<TFileRepository, 'folderId' | 'id'>> {
        try {
            return await this.connection.file.update({
                where: {
                    id: fileId,
                    owner: {
                        id: userId
                    }
                },
                data: {
                    removed: false,
                },
                select: {
                    folderId: true,
                    id: true
                }
            });

        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                } else if (e.code === 'P2023') {
                    /** TODO: add another exception class here. */
                    /** Incorrect id format */
                    throw new DbFileRecordDoesNotExist();
                }
            }

            throw e;
        }
    }

    async recoverFolder(folderId: TFileId, userId: string): Promise<any> {
        try {
            return await this.connection.folder.update({
                where: {
                    id: folderId,
                    owner: {
                        id: userId
                    }
                },
                data: {
                    removed: false,
                },
                select: {
                    id: true
                }
            });
        } catch (e: unknown) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new DbFileRecordDoesNotExist();
                } else if (e.code === 'P2023') {
                    /** TODO: add another exception class here. */
                    /** Incorrect id format */
                    throw new DbFileRecordDoesNotExist();
                }
            }

            throw e;
        }
    }

    // getFolderIdPath(folderId: string): string {

    // }

    /** TODO Need to disallow some username symbols. */
    /** TODO Remake tests to pass userId */
    async createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure> {
        try {

            return this.connection.folder.create({
                data: {
                    // parentId: '',
                    name: userId,
                    owner: {
                        connect: {
                            id: userId
                        }
                    },
                    path: [],
                    // parentFolderId: 
                    // parentFolder: {
                    //     create: {
                    //     }
                    // }
                },
            });
        } catch (e: unknown) {
            console.log(e);
        }

    }

    async getUserRootFolder(userId: string): Promise<TFolderRepository> {
        const user = await this.connection.user.findUnique({
            where: {
                id: userId
            },
            include: {
                rootFolder: true
            }
        });

        return (user as any).rootFolder;
        // return this.connection.folder.findFirst({
        //     where: {
        //         name: userId,
        //     },
        // });
    }

    async getChildrenFolders(folderId: TFolderId): Promise<TFolderRepository[]> {
        return this.connection.folder.findMany({
            where: {
                parentFolderId: folderId,
            },
        });
    }

    async getFolderById(folderId: TFolderId): Promise<TFolder | null> {
        try {
            const folder = await this.connection.folder.findFirst({
                where: {
                    id: folderId,
                },
                select: {
                    id: true,
                    name: true,
                    owner: true,
                    ownerId: true,
                    // parentId: true,
                    parentFolder: true,
                    path: true,
                },
            });

            if (folder !== null) {
                /** TODO fix */
                return folder as any;
            }

            return null;
        } catch (e: unknown) {
            throw e;
        }
    }

    async renameFolder(newFolderName: string, folderId: TFolderId): Promise<TFolderRepository> {
        const folder = await this.connection.folder.update({
            where: {
                id: folderId,
            },
            data: {
                name: newFolderName,
            },
        });

        return folder;
    }

    async changeFolderRemovedState(folderId: TFolderId, removedState: boolean): Promise<TFolderRepository> {
        const folder = await this.connection.folder.update({
            where: { id: folderId },
            data: { removed: removedState },
        });

        return folder;
    }

    async deleteFolder(folderId: TFolderId): Promise<TFolderRepository> {
        const folder = await this.connection.folder.delete({
            where: {
                id: folderId,
            },
            // include: {
            //     parentFolder: true
            // }
        });

        return folder;
    }

    async createFolder(userId: string, folderName: string, parentFolderId: TFolderId): Promise<TFolderRepository> {
        try {
            const parentFolder = await this.connection.folder.findUnique({
                where: {
                    id: parentFolderId,
                },
            });

            return this.connection.folder.create({
                data: {
                    // parentId: parentFolderId,
                    // parentFolderId: parentFolderId,
                    parentFolder: {
                        connect: {
                            id: parentFolderId
                        }
                    },
                    name: folderName,
                    owner: {
                        connect: {
                            id: userId
                        }
                    },
                    path: [...parentFolder.path, parentFolderId],
                },
            });
        } catch (e: unknown) {
            console.error(e);
        }
    }
}
