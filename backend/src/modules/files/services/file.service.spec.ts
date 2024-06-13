import { Test, TestingModule } from '@nestjs/testing';
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { ConfigModule } from '../../config/config.module';
import { IConfigService } from '../../config/dev.config.service';
import { TestConfigService } from '../../config/test.config.service';
import { UserGrantAccessUnauthorized } from '../../errors/logic/CannotCreateRootFolder';
import { FilesStructureModule } from '../../file-structure/file-structure.module';
import { DataRepository } from '../../file-structure/data.repository';
import { IDataRepository } from '../../file-structure/file-structure.type';
import { FilesSystemModule } from '../../file-system/file-system.module';
import { FileSystemService, IFileSystemService } from '../../file-system/file-system.service';
import { StorageModule } from '../../storage/storage.module';
import { IUserService } from '../../user/services/users.service';
import { UsersModule } from '../../user/users.module';
import { AccessService, FILE_EDIT, FILE_NONE, FILE_VIEW, FOLDER_EDIT, FOLDER_NONE, FOLDER_VIEW } from './access.service';
import { FileService } from './file.service';
import { FilesModule } from '../files.module';
import { AccessRepository } from './access.repository';

describe('FileService: share file', () => {
    let fileService: FileService;
    let config: IConfigService;
    let accessService: AccessService;
    let userService: IUserService;
    let dataRepo: IDataRepository;
    let fsService: IFileSystemService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule,
                FilesStructureModule,
                FilesSystemModule,
                FilesModule,
                UsersModule,
                StorageModule,
            ],
            providers: [
                FileSystemService,
                FileService,
                DataRepository,
                {
                    provide: TestConfigService,
                    // provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
                AccessRepository
                // userServiceDefaultProvider,
                // FileAccessRepository,
                // PostgresConnection
            ],
        }).compile();

        fileService = module.get<FileService>(FileService);

        fsService = module.get<IFileSystemService>(Symbol.for('IFileSystemService'));
        // config = module.get<IConfigService>(Symbol.for('IConfigService'));
        config = module.get<IConfigService>(TestConfigService);
        userService = module.get<IUserService>(Symbol.for('IUserService'));
        accessService = module.get<AccessService>(AccessService);
        dataRepo = module.get<IDataRepository>(Symbol.for('IFileStructureRepository'));

    });

    it('Should be defined + test config is activated', () => {
        // expect(fileService).toBeDefined();
        expect(userService).toBeDefined();
        expect(accessService).toBeDefined();
        expect(config).toBeDefined();

        const testFolder = config.getStoragePath().split('/').pop();
        // console.log(testFolder)
        expect(testFolder).toEqual("_test_storage");
    });

    it('Create file and manage its rights', async () => {
        await fsService.createRootFolder();

        const mainUser = await userService.createOne({
            password: '123',
            username: 'qwe',
            email: 'email1',
        });

        const friendUser = await userService.createOne({
            password: '456',
            username: 'qweqw',
            email: 'email2'
        });



        expect(mainUser.username).toEqual('qwe');
        const rootFolder = mainUser.rootFolder;
        // await fsService.createUserRootFolder(userSaved.username);

        await fsService.createUserRootFolder(rootFolder.id);
        expect(
            fs.access(
                fsService.getUserRootFolderPathStringSync(rootFolder.id)
            )
        ).resolves.toBeUndefined();



        const createdFile = await fileService.saveFileToFolder(
            mainUser.id,
            Buffer.from('asd', 'utf-8'),
            rootFolder.id,
            "testit",
            ".qw",
            11
        );
        // console.log(folder);

        const pathToFolder = fsService.getUserRootFolderPathStringSync(rootFolder.id);

        const files = await fs.readdir(pathToFolder);
        // console.log(pathToFolder);
        // console.log(files);

        const filePath = path.join(pathToFolder, createdFile.id);

        // console.log(filePath);
        expect(fs.access(filePath, constants.F_OK)).resolves.toBeUndefined();



        /** Check folder access */
        let folderShares = null;
        folderShares = await accessService.getFolderShares(rootFolder.id);
        expect(folderShares.length).toBe(0);

        let folderRights = null;
        folderRights = await accessService.setFolderAccess({ edit: true }, friendUser.id, rootFolder.id, mainUser.id);
        expect(folderRights).toMatchObject({ userRights: FOLDER_EDIT });

        folderShares = await accessService.getFolderShares(rootFolder.id);
        expect(folderShares.length).toBe(1);

        folderRights = await accessService.setFolderAccess({ view: true }, friendUser.id, rootFolder.id, mainUser.id);
        expect(folderRights).toMatchObject({ userRights: FOLDER_VIEW });

        folderShares = await accessService.getFolderShares(rootFolder.id);
        expect(folderShares.length).toBe(1);

        folderRights = await accessService.setFolderAccess({}, friendUser.id, rootFolder.id, mainUser.id);
        expect(folderRights).toBe(null);

        folderShares = await accessService.getFolderShares(rootFolder.id);
        expect(folderShares.length).toBe(0);

        folderRights = await accessService.setFolderAccess({ edit: true, view: true }, friendUser.id, rootFolder.id, mainUser.id);
        expect(folderRights).toMatchObject({ userRights: FOLDER_EDIT });

        folderShares = await accessService.getFolderShares(rootFolder.id);
        expect(folderShares.length).toBe(1);

        /** Remove shared folder access */

        /** TODO */

        try {
            await accessService.setFolderAccess({}, friendUser.id, rootFolder.id, mainUser.id);
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(UserGrantAccessUnauthorized);
        }

        /** Check file access */
        let fileRights = await accessService.setFileAccess({ edit: true }, friendUser.id, createdFile.id, mainUser.id);
        expect(fileRights).toMatchObject({ userRights: FILE_EDIT });

        fileRights = await accessService.setFileAccess({ view: true }, friendUser.id, createdFile.id, mainUser.id);
        expect(fileRights).toMatchObject({ userRights: FILE_VIEW });

        fileRights = await accessService.setFileAccess({}, friendUser.id, createdFile.id, mainUser.id);
        expect(fileRights).toBe(null);

        try {
            await accessService.setFileAccess({}, friendUser.id, createdFile.id, "not owner");
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(UserGrantAccessUnauthorized);
        }

        /** Check shared files */

        await accessService.setFileAccess({ view: true }, friendUser.id, createdFile.id, mainUser.id);
        const filesShared = await accessService.getFilesSharedWithUser(friendUser.id);
        // console.log(filesShared)
        expect(filesShared.length).toEqual(1);

        const filesShared2 = await accessService.getFilesSharedWithUser(mainUser.id);
        // console.log(mainUser.id)
        expect(filesShared2.length).toEqual(0);
    });

    it('Create multiple files with different extensions and get storage-extension info', async () => {
        await fsService.createRootFolder();

        const user = await userService.createOne({
            password: '123',
            username: 'qwe',
            email: 'email1',
        });

        expect(user.username).toEqual('qwe');
        const foldere = user.rootFolder;

        await fsService.createUserRootFolder(foldere.id);
        expect(
            fs.access(
                fsService.getUserRootFolderPathStringSync(foldere.id)
            )
        ).resolves.toBeUndefined();

        const buff1 = Buffer.from('a', 'utf-8');
        const buff2 = Buffer.from('aa', 'utf-8');
        const buff3 = Buffer.from('aaa', 'utf-8');
        const name = "testit";

        const file1 = await fileService.saveFileToFolder(user.id, buff1, foldere.id, name, ".png", buff1.length);
        const file2 = await fileService.saveFileToFolder(user.id, buff2, foldere.id, name, ".jpeg", buff2.length);
        const file3 = await fileService.saveFileToFolder(user.id, buff3, foldere.id, name, ".jpeg", buff3.length);

        const pathToFolder = fsService.getUserRootFolderPathStringSync(foldere.id);

        const filePath1 = path.join(pathToFolder, file1.id);
        const filePath2 = path.join(pathToFolder, file2.id);
        const filePath3 = path.join(pathToFolder, file3.id);

        expect(fs.access(filePath1, constants.F_OK)).resolves.toBeUndefined();
        expect(fs.access(filePath2, constants.F_OK)).resolves.toBeUndefined();
        expect(fs.access(filePath3, constants.F_OK)).resolves.toBeUndefined();

        const extensions = await dataRepo.getExtensionsInfo(user.id);
        const sizes = await dataRepo.getStorageInfo(user.id);

        expect(extensions).toHaveLength(2);
        expect(sizes).toHaveLength(2);

        expect(extensions.some((v) => v.count === 2 && v.extension === '.jpeg')).toBeTruthy();
        expect(extensions.some((v) => v.count === 1 && v.extension === '.png')).toBeTruthy();

        expect(sizes.some((v) => v.size === buff2.length + buff3.length && v.extension === '.jpeg')).toBeTruthy();
        expect(sizes.some((v) => v.size === buff1.length && v.extension === '.png')).toBeTruthy();
    });

    afterEach(async () => {
        await dataRepo.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
