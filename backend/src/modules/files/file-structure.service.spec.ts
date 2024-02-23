import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import { FILES } from './constants';
import { CreateUserRootFolderStructure, FileStructureService } from './file-structure.service';
import { PrismaClient as MongoClient } from '@prsm/generated/prisma-mongo-client-js';

describe('FileService', () => {
    let service: FileStructureService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileStructureService],
        }).compile();

        service = module.get<FileStructureService>(FileStructureService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Create user structure root folder.', async () => {
        const username = 'maksimbell';
        const result = await service.createUserRootFolder(username);

        expect(result).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            parentId: '',
            name: username
        });
    });

    it('Create user structure nested folder.', async () => {
        const username = 'maksimbell';
        const nestedFolderName = 'nested folder';
        const parentFolder = await service.createUserRootFolder(username);
        const result = await service.createUserFolder(username, parentFolder.id, nestedFolderName);

        expect(result).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolderName,
            parentId: parentFolder.id
        });
    });

    afterEach(() => {
        const mongoClient = new MongoClient();
        mongoClient.node.deleteMany();
    });
});
