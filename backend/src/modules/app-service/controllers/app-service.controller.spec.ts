import { Test, TestingModule } from '@nestjs/testing';
import { AppServiceController } from './app-service.controller';
import { FileStructureRepository } from '@src/modules/file-structure/file-structure.service';
import { FilesStructureModule } from '@src/modules/file-structure/file-structure.module';
import { FilesSystemModule } from '@src/modules/file-system/file-system.module';

describe('AppServiceController', () => {
    let controller: AppServiceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FilesSystemModule, FilesStructureModule],
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: FileStructureRepository,
                },
            ],
            controllers: [AppServiceController],
        }).compile();

        controller = module.get<AppServiceController>(AppServiceController);
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    });
});
