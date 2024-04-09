import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient, Prisma } from '@prsm/generated/prisma-mongo-client-js';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
import { MongoConnection } from './mongo-connection';

export type CreateUserRootFolderStructure = {
    parentId: string;
    name: string;
    id: string;
};


export type TFolder = {
    id: string;
    name: string;
    parentId: string;
    owner: string;
    path: string[];
};
export type TFileStructureRemoveAllData = Prisma.BatchPayload;

export type TFolderRepository = Prisma.Result<Prisma.NodeDelegate, Prisma.NodeFindUniqueArgs, 'findUnique'>;
export type TFileRepository = Prisma.Result<Prisma.FileDelegate, Prisma.FileFindUniqueArgs, 'findUnique'>;

export interface IFileStructureRepository {
    /** 
     * For testing purpose only!
     * TODO: remove from production code.
     */
    removeAllData(): Promise<TFileStructureRemoveAllData[]>;
    createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure>;
    createFolder(userId: string, folderName: string, parentFolderId: string): Promise<TFolderRepository>;
    getChildrenFiles(folderId: string): Promise<TFileRepository[]>;
    getChildrenFolders(folderId: string): Promise<TFolderRepository[]>;
    createFile(name: string, extension: string, folderId: string, userId: string): Promise<TFileRepository>;
    removeFile(fileId: string, softDelete: boolean): Promise<Pick<TFileRepository, 'folderId' | 'id'>>;
    getUserRootFolder(userId: string): Promise<TFolderRepository>;
    getFolderById(folderId: string): Promise<TFolder | null>;
    renameFolder(newFolderName: string, folderId: string): Promise<TFolderRepository>;
    deleteFolder(folderId: string): Promise<TFolderRepository>;
    getFolderPath(folderId: string): Promise<{ name: string, id: string; }[]>;
    changeFolderRemovedState(folderId: string, removedState: boolean): Promise<TFolderRepository>;
    getFileById(fileId: string): Promise<TFileRepository>;
}

@Injectable()
export class FileStructureRepository implements IFileStructureRepository {
    private connection: MongoClient;

    constructor() {
        this.connection = new MongoConnection().Connection;
    }

    async removeAllData(): Promise<TFileStructureRemoveAllData[]> {
        return Promise.all([
            this.connection.node.deleteMany(),
            this.connection.file.deleteMany()
        ]);
    }

    async getFolderPath(folderId: string): Promise<{ name: string, id: string; }[]> {
        try {
            const folder = await this.getFolderById(folderId);
            if (folder === null) {
                throw new NoFolderWithThisIdError(`No folder with id ${folderId}.`);
            }

            console.log(folder);
            const ancestorFoldersIds = folder.path.slice(1);
            console.log(ancestorFoldersIds);

            const names = await this.connection.node.findMany({
                where: {
                    id: {
                        in: ancestorFoldersIds,
                    },
                },
                select: {
                    name: true,
                    id: true
                },
            });

            const result = names.map((folder) => {
                return {
                    name: folder.name,
                    id: folder.id
                };
            });

            /** Remove userId - it's the highest ancestor folder name. */
            result.shift();

            if (ancestorFoldersIds.length !== 0) {
                /** Add this folder name to make path include this folder. */
                result.push({
                    name: folder.name,
                    id: folder.id
                });
            }

            console.log(result);
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

    async getChildrenFiles(folderId: string): Promise<TFileRepository[]> {
        return this.connection.file.findMany({
            where: {
                folderId,
            },
        });
    }

    async createFile(name: string, extension: string, folderId: string, userId: string): Promise<TFileRepository> {
        return this.connection.file.create({
            data: {
                extension,
                folderId,
                name,
                owner: userId,
            },
        });
    }

    async getFileById(fileId: string): Promise<TFileRepository> {
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

    async removeFile(fileId: string, softDelete: boolean): Promise<Pick<TFileRepository, 'folderId' | 'id'>> {
        try {
            if (softDelete) {
                return await this.connection.file.update({
                    where: {
                        id: fileId,
                    },
                    data: {
                        removed: true
                    },
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

    // getFolderIdPath(folderId: string): string {

    // }

    /** TODO Need to disallow some username symbols. */
    /** TODO Remake tests to pass userId */
    async createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure> {
        return this.connection.node.create({
            data: {
                parentId: '',
                name: userId,
                owner: userId,
                path: [userId],
            },
        });
    }

    async getUserRootFolder(userId: string): Promise<TFolderRepository> {
        return this.connection.node.findFirst({
            where: {
                name: userId,
            },
        });
    }

    async getChildrenFolders(folderId: string): Promise<TFolderRepository[]> {
        return this.connection.node.findMany({
            where: {
                parentId: folderId,
            },
        });
    }

    async getFolderById(folderId: string): Promise<TFolder | null> {
        try {
            const folder = await this.connection.node.findFirst({
                where: {
                    id: folderId,
                },
                select: {
                    id: true,
                    name: true,
                    owner: true,
                    parentId: true,
                    path: true,
                },
            });

            console.log(`folder ${folder?.id}`);
            if (folder !== null) {
                return folder;
            }

            return null;
        } catch (e: unknown) {
            throw e;
        }
    }


    async renameFolder(newFolderName: string, folderId: string): Promise<TFolderRepository> {
        const folder = await this.connection.node.update({
            where: {
                id: folderId
            },
            data: {
                name: newFolderName
            }
        });

        return folder;
    }

    async changeFolderRemovedState(folderId: string, removedState: boolean): Promise<TFolderRepository> {
        const folder = await this.connection.node.update({
            where: {
                id: folderId
            },
            data:
            {
                removed: removedState
            }
        });

        return folder;
    }

    async deleteFolder(folderId: string): Promise<TFolderRepository> {
        const folder = await this.connection.node.delete({
            where: {
                id: folderId
            }
        });

        return folder;
    }

    async createFolder(userId: string, folderName: string, parentFolderId: string): Promise<TFolderRepository> {
        const parentFolder = await this.connection.node.findUnique({
            where: {
                id: parentFolderId,
            },
        });

        return this.connection.node.create({
            data: {
                parentId: parentFolderId,
                name: folderName,
                owner: userId,
                path: [...parentFolder.path, parentFolderId],
            },
        });
    }
}
