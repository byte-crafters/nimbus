import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import { IConfigService } from '../config/dev.config.service';
import { TestConfigService } from '../config/test.config.service';
import { FileService } from './file.service';

describe('FileService', () => {
    let service: FileService;
    let config: IConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileService,
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService
                }
            ],
        }).compile();

        service = module.get<FileService>(FileService);
        config = module.get<IConfigService>(Symbol.for('IConfigService'))
    });

    afterEach(async () => {
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
