import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { DataRepository } from '../../file-structure/data.repository';
import { FilesStructureModule } from '../../file-structure/file-structure.module';
import { FilesSystemModule } from '../../file-system/file-system.module';
import { FileSystemService } from '../../file-system/file-system.service';
import { TestConfigService } from '../../config/test.config.service';
import { FilesModule } from '../files.module';
import { FileService } from '../services/file.service';
import { UsersModule } from '../../user/users.module';
import { userServiceDefaultProvider } from '@src/dependencies/providers';

describe('FilesController', () => {
    let controller: FilesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FilesStructureModule, FilesSystemModule, FilesModule, UsersModule],
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: DataRepository,
                },
                {
                    provide: Symbol.for('IFileSystemService'),
                    useClass: FileSystemService,
                },
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
                userServiceDefaultProvider,
                FileService,
            ],
            controllers: [FilesController],
        }).compile();

        controller = module.get<FilesController>(FilesController);
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should return file access rights info', async () => {
        
    })
});
