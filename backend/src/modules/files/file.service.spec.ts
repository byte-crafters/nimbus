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

describe('FileService', () => {
    let service: FileService;
    let config: IConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                FilesStructureModule,
                FilesSystemModule,
                FilesModule,
                UsersModule,
            ],
            providers: [{
                provide: Symbol.for('IConfigService'),
                useClass: TestConfigService
            }],
        }).compile();

        service = module.get<FileService>(FileService);
        config = module.get<IConfigService>(Symbol.for('IConfigService'));
    });

    it("Should be defined", () => {
        expect(service).toBeDefined();
    });

    afterEach(async () => {
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });
});
