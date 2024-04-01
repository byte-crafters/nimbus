import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import path from 'path';
import { FileSystemService } from '../file-system/file-system.service';
import { FILES } from './constants';

describe('FileService', () => {
    let service: FileSystemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileSystemService],
        }).compile();

        service = module.get<FileSystemService>(FileSystemService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Create folder.', async () => {
        await service.createRootFolder().then(() => {
            expect(fs.access(FILES.TEST_FILES_PATH)).resolves;
        });
    });

    it('Create user root folder BEFORE creating root files folder.', async () => {
        const username = 'artembellId';
        await service.createUserRootFolder(username).catch(() => {
            expect(
                fs.access(service.getUserRootFolderPathStringSync(username)),
            ).rejects.toThrow();
        });
    });

    it('Create user root folder AFTER creating root files folder.', async () => {
        await service.createRootFolder().then(() => {
            const username = 'artembellId';
            service.createUserRootFolder(username).catch(() => {
                expect(
                    fs.access(
                        service.getUserRootFolderPathStringSync(username),
                    ),
                ).resolves.toBeTruthy();
            });
        });
    });

    it("Create user nested folder by path of parent folders' id", async () => {
        const folders = ['maksimbellId', 'testy'];
        await service
            .createRootFolder()
            .then(() => {
                return service.createUserRootFolder(folders[0]);
            })
            .then(() => {
                return service.createNestedFolder(folders);
            })
            .then(() => {
                const folderPath = path.join(FILES.TEST_FILES_PATH, ...folders);
                console.log(folderPath);
                expect(fs.access(folderPath)).resolves.toBeUndefined();
            });
    });

    afterEach(async () => {
        await fs.rm(FILES.TEST_FILES_PATH, { recursive: true, force: true });
    });
});
