import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient, Prisma } from '@prsm/generated/prisma-mongo-client-js';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';

export type CreateUserRootFolderStructure = {
    parentId: string;
    name: string;
    id: string;
};

export interface IFileStructureService {
    // getFolderIdPath(folderId: string): string;
}

export type TFolder = {
    id: string;
    name: string;
    parentId: string;
    owner: string;
    path: string[];
};

export type TFile = {
    id: string;
    extension: string;
    folderId: string;
    name: string;
    owner: string;
};

@Injectable()
export class FileStructureService implements IFileStructureService {
    constructor() { }

    async getFoldersNames(folderIds: string[]) {
        const mongoClient = new MongoClient();

        // return mongoClient.node.findMany({
        //     where: {
        //         id
        //     },
        //     select: {

        //     }
        // })
    }

    async getFolderPath(folderId: string): Promise<{ name: string, id: string; }[]> {
        try {
            const mongoClient = new MongoClient();

            const folder = await this.getFolderById(folderId);
            if (folder === null) {
                throw new NoFolderWithThisIdError(`No folder with id ${folderId}.`);
            }

            console.log(folder);
            const ancestorFoldersIds = folder.path.slice(1);
            console.log(ancestorFoldersIds);

            const names = await mongoClient.node.findMany({
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

    async getChildrenFilesOf(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.file.findMany({
            where: {
                folderId,
            },
        });
    }

    createFile(name: string, extension: string, folderId: string, userId: string): Promise<TFile> {
        const mongoClient = new MongoClient();

        return mongoClient.file.create({
            data: {
                extension,
                folderId,
                name,
                owner: userId,
            },
        });
    }

    getFileById(fileId: string): Promise<TFile> {
        try {
            const mongoClient = new MongoClient();

            return mongoClient.file.findUnique({
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

    removeFile(fileId: string): Promise<Pick<TFile, 'folderId' | 'id'>> {
        try {
            const mongoClient = new MongoClient();

            return mongoClient.file.delete({
                where: {
                    id: fileId,
                },
                select: {
                    folderId: true,
                    id: true,
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

    // getFolderIdPath(folderId: string): string {

    // }

    /** TODO Need to disallow some username symbols. */
    /** TODO Remake tests to pass userId */
    async createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure> {
        const mongoClient = new MongoClient();

        return mongoClient.node.create({
            data: {
                parentId: '',
                name: userId,
                owner: userId,
                path: [userId],
            },
        });
    }

    getUserRootFolder(userId: string): Promise<TFolder> {
        const mongoClient = new MongoClient();

        return mongoClient.node.findFirst({
            where: {
                name: userId,
            },
        });
    }

    getChildrenFoldersOf(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.findMany({
            where: {
                parentId: folderId,
            },
        });
    }

    async getFolderById(folderId: string): Promise<TFolder | null> {
        try {
            const mongoClient = new MongoClient();

            const folder = await mongoClient.node.findFirst({
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
            console.log('cauht');
            console.log(e);
            throw e;
        }
    }


    async renameFolder(newFolderName: string, folderId: string) {
        const mongoClient = new MongoClient();

        const folder = await mongoClient.node.update({
            where: {
                id: folderId
            },
            data: {
                name: newFolderName
            }
        });

        return folder;
    }

    async changeFolderRemovedState(folderId: string, removedState: boolean) {
        const mongoClient = new MongoClient();

        const folder = await mongoClient.node.update({
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

    async deleteFolder(folderId: string) {
        const mongoClient = new MongoClient();

        const folder = await mongoClient.node.delete({
            where: {
                id: folderId
            }
        });

        return folder;
    }

    async createUserFolder(userId: string, folderName: string, parentFolderId: string) {
        const mongoClient = new MongoClient();

        const parentFolder = await mongoClient.node.findUnique({
            where: {
                id: parentFolderId,
            },
        });

        return mongoClient.node.create({
            data: {
                parentId: parentFolderId,
                name: folderName,
                owner: userId,
                path: [...parentFolder.path, parentFolderId],
            },
        });
    }
}
