import { Injectable } from '@nestjs/common';
import {
    PrismaClient as MongoClient,
    Prisma,
} from '@prsm/generated/prisma-mongo-client-js';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';

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
    constructor() {}

    async getFolderPath(folderId: string) {
        const mongoClient = new MongoClient();

        const folder = await this.getFolderById(folderId);

        return mongoClient.node
            .findMany({
                where: {
                    id: {
                        in: folder.path.slice(1),
                    },
                },
                select: {
                    name: true,
                },
            })
            .then((names) => names.map((folder) => folder.name));
    }

    async getChildrenFilesOf(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.file.findMany({
            where: {
                folderId,
            },
        });
    }

    createFile(
        name: string,
        extension: string,
        folderId: string,
        userId: string,
    ): Promise<TFile> {
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
    async createUserRootFolder(
        userId: string,
    ): Promise<CreateUserRootFolderStructure> {
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

    getFolderById(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.findFirst({
            where: {
                id: folderId,
            },
        });
    }

    async createUserFolder(
        userId: string,
        folderName: string,
        parentFolderId: string,
    ) {
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
