import { Injectable } from '@nestjs/common';
import { Prisma } from '@prsm/generated/prisma-postgres-client-js';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
import { PostgresConnection } from '../storage/postgres-connection';
import { CreateUserRootFolderStructure, IFileStructureRepository, TFileId, TFileRepository, TFileStructureRemoveAllData, TFolder, TFolderId, TFolderRepository } from './file-structure.type';
import { createReadStream } from 'fs';


@Injectable()
export class FileStructureRepository implements IFileStructureRepository {
    private connection: PostgresConnection;

    constructor() {
        this.connection = new PostgresConnection();
    }

    async removeAllData(): Promise<TFileStructureRemoveAllData[]> {
        /** 
         * Used only for tests.
         * Need to run sequentially to avoid `foreign key constaint violation` error.
         */
        const c4 = await this.connection.fileAccess.deleteMany()
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

            /** Remove userId - it's the highest ancestor folder name. */
            result.shift();

            if (ancestorFoldersIds.length !== 0) {
                /** Add this folder name to make path include this folder. */
                result.push({
                    name: folder.name,
                    id: folder.id,
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

    async getChildrenFiles(folderId: TFolderId): Promise<TFileRepository[]> {
        return this.connection.file.findMany({
            where: {
                folderId,
            },
        });
    }

    async createFile(name: string, extension: string, folderId: TFolderId, userId: string): Promise<TFileRepository> {
        try {

            return this.connection.file.create({
                data: {
                    extension,
                    // folderId,
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
                    },
                },
            });
        } catch (e: unknown) {
            console.error(e)
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
        return this.connection.folder.findFirst({
            where: {
                name: userId,
            },
        });
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
                    // parentId: true,
                    parentFolder: true,
                    path: true,
                },
            });

            console.log(`folder ${folder?.id}`);
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
            console.error(e)
        }
    }
}
