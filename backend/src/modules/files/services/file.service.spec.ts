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
    let helper: IDataRepository;
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
        helper = module.get<IDataRepository>(Symbol.for('IFileStructureRepository'));

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
            username: 'qwe'
        });

        const friendUser = await userService.createOne({
            password: '456',
            username: 'qweqw'
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
            ".qw"
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

    afterEach(async () => {
        await helper.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
