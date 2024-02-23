import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { FILES } from './constants';
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
    createUserRootFolder(username: string): Promise<CreateUserRootFolderStructure> {
        const mongoClient = new MongoClient();

        return mongoClient.node.create({
            data: {
                parentId: '',
                name: username,
            },
        });
    }

    createUserFolder(username: string, parentFolderId: string, name: string) {
        const mongoClient = new MongoClient();

        return mongoClient.node.create({
            data: {
                parentId: parentFolderId,
                name: name,
            },
        });
    }
}
