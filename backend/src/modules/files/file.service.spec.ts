import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import { FILES } from './constants';
import { FileService } from './file.service';

describe('FileService', () => {
    let service: FileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileService],
        }).compile();

        service = module.get<FileService>(FileService);
    });

    afterEach(async () => {
        await fs.rm(FILES.TEST_FILES_PATH, { recursive: true, force: true });
    });
});
