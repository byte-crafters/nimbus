import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient } from '@prsm/generated/prisma-mongo-client-js';

export type CreateUserRootFolderStructure = {
    parentId: string,
    name: string,
    id: string;
};

export interface FileStructureService {

}

@Injectable()
export class FileStructureService implements FileStructureService {
    constructor(

    ) { }

    /** TODO Need to disallow some username symbols. */
    /** TODO Remake tests to pass userId */
    async createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure> {
        const mongoClient = new MongoClient();

        console.log(await mongoClient.node.findMany());

        return mongoClient.node.create({
            data: {
                parentId: '',
                name: userId,
                owner: userId
            },
        });
    }

    getUserRootFolder(userId: string): Promise<any> {
        const mongoClient = new MongoClient();

        return mongoClient.node.findFirst({
            where: {
                owner: userId
            },
        });
    }

    getChildrenFoldersOf(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.findMany({
            where: {
                parentId: folderId
            },
        });
    }

    getFolderById(folderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.findFirst({
            where: {
                id: folderId
            },
        });
    }

    async createUserFolder(userId: string, folderName: string, parentFolderId: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.create({
            data: {
                parentId: parentFolderId,
                name: folderName,
                owner: userId
            },
        });
    }
}
