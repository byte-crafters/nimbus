import { Test, TestingModule } from '@nestjs/testing';
import { AppServiceController } from './app-service.controller';
// import { DataRepository } from '@src/modules/file-structure/file-structure.service';
import { FilesStructureModule } from '@src/modules/file-structure/file-structure.module';
import { FilesSystemModule } from '@src/modules/file-system/file-system.module';
import { DataRepository } from '@src/modules/file-structure/data.repository';

describe('AppServiceController', () => {
    let controller: AppServiceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [FilesSystemModule, FilesStructureModule],
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: DataRepository,
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
