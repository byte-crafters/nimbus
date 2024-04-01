import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppServiceModule } from '@modules/app-service/app-service.module';
import * as request from 'supertest';

describe('AppServiceController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppServiceModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/health (GET)', () => {
        return request(app.getHttpServer()).get('/health').expect(200).expect('alive');
    });
});
