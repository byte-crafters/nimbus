import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import { IConfigService } from '../config/dev.config.service';
import { TestConfigService } from '../config/test.config.service';
import { FileService } from './file.service';
import { FileStructureRepository } from '../file-structure/file-structure.service';
import { ConfigModule } from '../config/config.module';
import { FilesStructureModule } from '../file-structure/file-structure.module';
import { FilesSystemModule } from '../file-system/file-system.module';
import { UsersModule } from '../user/users.module';
import { FilesModule } from './files.module';
import { FileAccessRepository } from './file-access.service';
import { userServiceDefaultProvider } from '@src/dependencies/providers';
import { IUserService, UsersRepository } from '../user/services/users.service';
import { IFileStructureRepository } from '../file-structure/file-structure.type';
import { PostgresConnection } from '../storage/postgres-connection';
import { StorageModule } from '../storage/storage.module';
import { FileSystemService, IFileSystemService } from '../file-system/file-system.service';
import { TRights } from './file.type';

describe('FileService', () => {
    let fileService: FileService;
    let config: IConfigService;
    let fileAccessService: FileAccessRepository;
    let userService: IUserService;
    let helper: IFileStructureRepository;
    let fsService: IFileSystemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule,
                FilesStructureModule,
                FilesSystemModule,
                FilesModule,
                UsersModule,
                StorageModule
            ],
            providers: [
                FileSystemService,
                FileService,
                FileStructureRepository,
                {
                    provide: TestConfigService,
                    // provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
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
        fileAccessService = module.get<FileAccessRepository>(FileAccessRepository);
        helper = module.get<IFileStructureRepository>(Symbol.for('IFileStructureRepository'));

    });

    it('Should be defined + test config is activated', () => {
        // expect(fileService).toBeDefined();
        expect(userService).toBeDefined();
        expect(fileAccessService).toBeDefined();
        expect(config).toBeDefined();

        const testFolder = config.getStoragePath().split('/').pop();
        // console.log(testFolder)
        expect(testFolder).toEqual("_test_storage");
    });

    it('Create file and manage its rights', async () => {
        await fsService.createRootFolder();

        const userSaved = await userService.createOne({
            password: '123',
            username: 'qwe'
        });



        expect(userSaved.username).toEqual('qwe');
        const rootFolder = userSaved.rootFolder;
        // await fsService.createUserRootFolder(userSaved.username);

        await fsService.createUserRootFolder(rootFolder.id);
        expect(
            fs.access(
                fsService.getUserRootFolderPathStringSync(rootFolder.id)
            )
        ).resolves.toBeUndefined();



        const folder = await fileService.saveFileToFolder(
            userSaved.id,
            Buffer.from('asd', 'utf-8'),
            rootFolder.id,
            "testit",
            ".qw"
        );
        // console.log(folder);

        expect(
            fs.access(
                fsService.getUserRootFolderPathStringSync(rootFolder.id) + "/" + folder.id
            )
        ).resolves.toBeUndefined();


        const rights = await fileAccessService.create("01010111", userSaved.id, folder.id);
        // console.log(a);

        expect(rights).toMatchObject({
            userRights: "01010111"
        })
    });

    afterEach(async () => {
        await helper.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
