import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient as MongoClient } from '@prsm/generated/prisma-mongo-client-js';
import { User } from '../user/models/User';
import { CreateUserRootFolderStructure, FileStructureService } from './file-structure.service';

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
        const user = new User({ password: '', username: 'maksimbell' });
        const result = await service.createUserRootFolder(user.id);

        expect(result).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            parentId: '',
            name: user.username,
        });
    });

    it('Create user structure nested folder.', async () => {
        const user = new User({ password: '', username: 'maksimbell' });
        const nestedFolderName = 'nested folder';
        const parentFolder = await service.createUserRootFolder(user.id);
        const result = await service.createUserFolder(user.id, parentFolder.id, nestedFolderName);

        expect(result).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolderName,
            parentId: parentFolder.id,
        });
    });

    afterEach(() => {
        const mongoClient = new MongoClient();
        mongoClient.node.deleteMany();
    });
});
