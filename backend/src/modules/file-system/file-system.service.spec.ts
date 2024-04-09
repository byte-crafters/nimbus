import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import path from 'path';
import { ConfigModule } from '../config/config.module';
import { IConfigService } from '../config/dev.config.service';
import { TestConfigService } from '../config/test.config.service';
import { FileSystemService, IFileSystemService } from './file-system.service';

describe('FileSystemService', () => {
    let service: IFileSystemService;
    let config: IConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            // imports: [ConfigModule],
            providers: [
                FileSystemService,
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService
                }],
        }).compile();

        service = module.get<FileSystemService>(FileSystemService);
        config = module.get<IConfigService>(Symbol.for('IConfigService'));
    });

    it('Should be defined.', () => {
        expect(service).toBeDefined();
        expect(config).toBeDefined();
    });

    it('Create root folder.', async () => {
        await service.createRootFolder();
        expect(fs.access(config.getStoragePath())).resolves;
    });

    it('Create user root folder BEFORE creating root files folder.', async () => {
        const username = 'artembellId';
        await service.createUserRootFolder(username).catch(() => {
            expect(fs.access(service.getUserRootFolderPathStringSync(username))).rejects.toThrow();
        });
    });

    it('Create user root folder AFTER creating root files folder.', async () => {
        await service.createRootFolder();
        const username = 'artembellId';
        try {
            service.createUserRootFolder(username);
        } catch (e: unknown) {
            expect(fs.access(service.getUserRootFolderPathStringSync(username))).resolves.toBeTruthy();
        }
    });

    it("Create user nested folder by path of parent folders' id", async () => {
        await service.createRootFolder();
        const folders = ['maksimbellId', 'testy'];
        await service.createUserRootFolder(folders[0]);
        await service.createNestedFolder(folders) 
        const folderPath = path.join(config.getStoragePath(), ...folders);
        expect(fs.access(folderPath)).resolves.toBeUndefined();
    });

    it("Write file.", async () => {
        await service.createRootFolder();
        expect(fs.access(config.getStoragePath())).resolves.toBeUndefined();

        const filePath = path.join(config.getStoragePath(), "file.name.extension");
        const fileContent = "TestString";
        await service.writeFile(
            Buffer.from(fileContent, 'utf-8'),
            filePath
        );
        expect(fs.access(filePath)).resolves.toBeUndefined();

        const fileStream = service.getFileStream(filePath);
        const chunks = [];

        for await (const chunk of fileStream) {
            chunks.push(Buffer.from(chunk));
        }

        const string = Buffer.concat(chunks).toString("utf-8");
        expect(string).toEqual(fileContent);
    });

    it("Remove folder", async () => {

    });

    it("Remove file", async () => {

    });

    afterEach(async () => {
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
