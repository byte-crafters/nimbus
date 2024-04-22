import { AppModule } from '@modules/app/app.module';
import { User } from '@modules/user/models/User';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IFileStructureRepository } from '@src/modules/file-structure/file-structure.type';
import { IFileService } from '@src/modules/files/file.service';
import request from 'supertest';

describe('AppServiceController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let helper: IFileStructureRepository;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        jwtService = moduleFixture.get<JwtService>(JwtService);
        helper = moduleFixture.get<IFileStructureRepository>(Symbol.for('IFileStructureRepository'));

        await app.init();
    });

    it('Register new user and login afterwards', async () => {
        const user = new User({ username: Date.now() + 'one', password: '123' });
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201)
            .expect(async (response: request.Response) => {
                const { access_token: accessToken } = response.body;
                expect(typeof accessToken).toBe('string');
                expect(accessToken.length).toBeGreaterThan(200);
            });

        return request(app.getHttpServer())
            .post('/auth/login')
            .send(user)
            .expect(200)
            .expect(async (response: request.Response) => {
                const { access_token: accessToken } = response.body;
                expect(typeof accessToken).toBe('string');
                expect(accessToken.length).toBeGreaterThan(200);
            });
    });


    afterEach(async () => {
        await helper.removeAllData();
    });

    afterAll(async () => {
        await helper.removeAllData();
        await app.close();
    });
});
