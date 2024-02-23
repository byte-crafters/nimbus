import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemService } from './file-system.service';
import * as fs from 'node:fs/promises';
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
        await service.createRootFolder()
            .then(() => {
                expect(fs.access(FILES.FILES_PATH)).resolves;
            });
    });

    it('Create user root folder BEFORE creating root files folder.', async () => {
        const username = 'artembell';
        await service.createUserRootFolder(username)
            .catch(() => {
                expect(fs.access(service.getUserRootFolderPathString(username)))
                    .rejects
                    .toThrow();
            });
    });

    it('Create user root folder AFTER creating root files folder.', async () => {
        await service.createRootFolder().then(() => {

            const username = 'artembell';
            service.createUserRootFolder(username)
                .catch(() => {
                    expect(fs.access(service.getUserRootFolderPathString(username)))
                        .resolves
                        .toBeTruthy();
                });
        });
    });

    afterEach(async () => {
        await fs.rm(FILES.FILES_PATH, { recursive: true, force: true });
    });
});
