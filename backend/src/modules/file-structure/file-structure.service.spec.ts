import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/models/User';
import {
    CreateUserRootFolderStructure,
    FileStructureRepository,
    IFileStructureRepository,
    TFileRepository,
} from './file-structure.service';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { ObjectId } from 'bson';
import { TestConfigService } from '../config/test.config.service';

describe('FileStructureRepository: ', () => {
    let service: IFileStructureRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: FileStructureRepository,
                },
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
            ],
        }).compile();

        service = module.get<IFileStructureRepository>(Symbol.for('IFileStructureRepository'));
    });

    it('Should be defined.', () => {
        expect(service).toBeDefined();
    });

    it('Create user structure root folder.', async () => {
        const user = new User({ password: '', username: 'maksimbell' });
        const result = await service.createUserRootFolder(user.id);

        expect(result).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            parentId: '',
            name: user.id,
        });
    });

    it('Create user structure with nested folders.', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell' });
        const nestedFolder1Name = 'nested_1';
        const nestedFolder2Name = 'nested_2';
        const nestedFolder11Name = 'nested_1_1';

        /** Create root user folder */
        const parentFolder = await service.createUserRootFolder(user.id);

        /** Create folder `username/nested_1` */
        const nestedFolder1 = await service.createFolder(user.id, nestedFolder1Name, parentFolder.id);
        expect(nestedFolder1).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder1Name,
            parentId: parentFolder.id,
        });

        const children = await service.getChildrenFolders(parentFolder.id);
        expect(children.length).toEqual(1);

        /** Create folder `username/nested_2` */
        const nestedFolder2 = await service.createFolder(user.id, nestedFolder2Name, parentFolder.id);
        expect(nestedFolder2).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder2Name,
            parentId: parentFolder.id,
        });

        const children2 = await service.getChildrenFolders(parentFolder.id);
        expect(children2.length).toEqual(2);

        /** Create folder `username/nested_1/nested_1_1` */
        const nestedFolder11 = await service.createFolder(user.id, nestedFolder11Name, nestedFolder1.id);
        expect(nestedFolder11).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder11Name,
            parentId: nestedFolder1.id,
        });

        const children3 = await service.getChildrenFolders(nestedFolder1.id);
        expect(children3.length).toEqual(1);
    });

    it('Create user structure with nested files.', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell' });
        /** Create root user folder */
        const parentFolder = await service.createUserRootFolder(user.id);

        const file = await service.createFile('testFile', 'png', parentFolder.id, user.id);

        expect(file).toMatchObject<Omit<TFileRepository, 'id'>>({
            extension: 'png',
            folderId: parentFolder.id,
            name: 'testFile',
            owner: user.id,
            removed: false,
        });

        const children3 = await service.getChildrenFiles(parentFolder.id);
        expect(children3.length).toEqual(1);

        const file2 = await service.createFile('testFile2', 'png2', parentFolder.id, user.id);

        expect(file2).toMatchObject<Omit<TFileRepository, 'id'>>({
            extension: 'png2',
            folderId: parentFolder.id,
            name: 'testFile2',
            owner: user.id,
            removed: false,
        });

        const children4 = await service.getChildrenFiles(parentFolder.id);
        expect(children4.length).toEqual(2);
    });

    it('Remove existing file (hard and soft delete).', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell' });
        /** Create root user folder */
        const parentFolder = await service.createUserRootFolder(user.id);

        const file = await service.createFile('testFile', 'png', parentFolder.id, user.id);

        const children3 = await service.getChildrenFiles(parentFolder.id);
        expect(children3.length).toEqual(1);

        /** Soft delete */
        await service.removeFile(file.id, true);
        const children5 = await service.getChildrenFiles(parentFolder.id);
        expect(children5.length).toEqual(1);

        /** Hard delete */
        await service.removeFile(file.id, false);

        const children4 = await service.getChildrenFiles(parentFolder.id);
        expect(children4.length).toEqual(0);
    });

    it('Remove not existing file.', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell' });

        /** Create root user folder */
        try {
            await service.removeFile('unknown', false);
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(DbFileRecordDoesNotExist);
        }

        try {
            await service.removeFile(new ObjectId().toString(), false);
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(DbFileRecordDoesNotExist);
        }
    });

    it('Remove existing folder (hard and soft delete).', async () => {});

    it('Remove not existing folder.', async () => {});

    it('Rename existing folder.', async () => {});

    afterEach(async () => {
        await service.removeAllData();
    });
});
