import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/models/User';
import { DataRepository } from './data.repository';
import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
import { ObjectId } from 'bson';
import { TestConfigService } from '../config/test.config.service';
import { IDataRepository, CreateUserRootFolderStructure, TFileRepository } from './file-structure.type';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { IUserService } from '../user/services/users.service';
import { StorageModule } from '../storage/storage.module';

describe('FileStructureRepository: ', () => {
    let service: IDataRepository;
    let userService: IUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                StorageModule
            ],
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: DataRepository,
                },
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
                userServiceDefaultProvider
            ],
        }).compile();

        service = module.get<IDataRepository>(Symbol.for('IFileStructureRepository'));
        userService = module.get<IUserService>(Symbol.for('IUserService'));
    });

    it('Should be defined.', () => {
        expect(service).toBeDefined();
    });

    it('Create user structure root folder.', async () => {
        const user = new User({ password: '', username: 'maksimbell', email: 'email' });
        const userSaved = await userService.createOne({
            password: user.password,
            username: user.username,
            email: user.email
        });

        const result = userSaved.rootFolder;
        // const result = await service.createUserRootFolder(user.id);

        expect(result).toMatchObject({
            // parentId: ,
            parentFolderId: null,
            // name: user.id,
            name: null
        });
    });

    it('Create user structure with nested folders.', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell', email: 'email' });
        const nestedFolder1Name = 'nested_1';
        const nestedFolder2Name = 'nested_2';
        const nestedFolder11Name = 'nested_1_1';

        const userSaved = await userService.createOne({
            password: user.password,
            username: user.username,
            email: user.email
        });
        const parentFolder = userSaved.rootFolder;

        /** Create root user folder */
        // const parentFolder = await service.createUserRootFolder(user.id);

        /** Create folder `username/nested_1` */
        const nestedFolder1 = await service.createFolder(userSaved.id, nestedFolder1Name, parentFolder.id);
        expect(nestedFolder1).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder1Name,
            parentFolderId: parentFolder.id,
        });

        const children = await service.getChildrenFolders(parentFolder.id);
        expect(children.length).toEqual(1);

        /** Create folder `username/nested_2` */
        const nestedFolder2 = await service.createFolder(userSaved.id, nestedFolder2Name, parentFolder.id);
        expect(nestedFolder2).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder2Name,
            parentFolderId: parentFolder.id,

        });

        const children2 = await service.getChildrenFolders(parentFolder.id);
        expect(children2.length).toEqual(2);

        /** Create folder `username/nested_1/nested_1_1` */
        const nestedFolder11 = await service.createFolder(userSaved.id, nestedFolder11Name, nestedFolder1.id);
        expect(nestedFolder11).toMatchObject<Omit<CreateUserRootFolderStructure, 'id'>>({
            name: nestedFolder11Name,
            parentFolderId: nestedFolder1.id,
        });

        const children3 = await service.getChildrenFolders(nestedFolder1.id);
        expect(children3.length).toEqual(1);
    });

    it('Create user structure with nested files.', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell', email: 'email' });

        const userSaved = await userService.createOne({
            password: user.password,
            username: user.username,
            email: user.email
        });
        const parentFolder = userSaved.rootFolder;
        /** Create root user folder */

        /**
         * TODO/fix: remove 
         */
        // const parentFolder = await service.createUserRootFolder(user.id);

        const file = await service.createFile('testFile', 'png', parentFolder.id, userSaved.id, 11);

        expect(file).toMatchObject<any>({
            extension: 'png',
            folderId: parentFolder.id,
            name: 'testFile',
            ownerId: userSaved.id,
            removed: false,
        });

        const children3 = await service.getChildrenFiles(parentFolder.id);
        expect(children3.length).toEqual(1);

        const file2 = await service.createFile('testFile2', 'png2', parentFolder.id, userSaved.id, 11);

        expect(file2).toMatchObject<any>({
            extension: 'png2',
            folderId: parentFolder.id,
            name: 'testFile2',
            ownerId: userSaved.id,
            removed: false,
        });

        const children4 = await service.getChildrenFiles(parentFolder.id);
        expect(children4.length).toEqual(2);
    });

    it('Remove existing file (hard and soft delete).', async () => {
        /** Fixtures */
        const user = new User({ password: '', username: 'maksimbell', email: 'email' });

        const userSaved = await userService.createOne({
            password: user.password,
            username: user.username,
            email: user.email
        });
        const parentFolder = userSaved.rootFolder;

        /** Create root user folder */
        // const parentFolder = await service.createUserRootFolder(user.id);

        const file = await service.createFile('testFile', 'png', parentFolder.id, userSaved.id, 11);

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

    // it('Remove not existing file.', async () => {
    //     /** Fixtures */
    //     const user = new User({ password: '', username: 'maksimbell' });

    //     /** Create root user folder */
    //     try {
    //         await service.removeFile('unkown', false);
    //     } catch (e: unknown) {
    //         expect(e).toBeInstanceOf(DbFileRecordDoesNotExist);
    //     }

    //     try {
    //         await service.removeFile('', false);
    //     } catch (e: unknown) {
    //         expect(e).toBeInstanceOf(DbFileRecordDoesNotExist);
    //     }
    // });

    it('Save file with cyrillic name.', async () => {
        const user = new User({ password: '', username: 'maksimbell', email: 'email' });

        const userSaved = await userService.createOne({
            password: user.password,
            username: user.username,
            email: user.email
        });
        const parentFolder = userSaved.rootFolder;
        /** Create root user folder */

        /**
         * TODO/fix: remove 
         */
        // const parentFolder = await service.createUserRootFolder(user.id);

        const file = await service.createFile('файл', 'png', parentFolder.id, userSaved.id, 11);

        expect(file).toMatchObject<any>({
            extension: 'png',
            folderId: parentFolder.id,
            name: 'файл',
            ownerId: userSaved.id,
            removed: false,
        });

        const children3 = await service.getChildrenFiles(parentFolder.id);
        expect(children3.length).toEqual(1);
    });

    it('Remove existing folder (hard and soft delete).', async () => { });

    it('Remove not existing folder.', async () => { });

    it('Rename existing folder.', async () => { });

    afterEach(async () => {
        await service.removeAllData();
    });
});
