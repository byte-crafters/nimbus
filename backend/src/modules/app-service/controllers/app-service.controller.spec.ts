import { Test, TestingModule } from '@nestjs/testing';
import { AppServiceController } from './app-service.controller';

describe('AppServiceController', () => {
    let controller: AppServiceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppServiceController],
        }).compile();

        controller = module.get<AppServiceController>(AppServiceController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
