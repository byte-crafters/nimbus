import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';

describe('AppServiceController', () => {
    let controller: FilesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
        }).compile();

        controller = module.get<FilesController>(FilesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
