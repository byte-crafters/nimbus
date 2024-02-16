import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@modules/app/app.module';
import { User } from '@modules/user/models/User';

describe('AppServiceController (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        jwtService = moduleFixture.get<JwtService>(JwtService);
    });

    it('/auth/login (POST)', () => {
        const user = new User({ username: 'one', password: '123' });
        return request(app.getHttpServer())
            .post('/auth/login')
            .send(user)
            .expect(201)
            .expect(async ({ body }: request.Response) => {
                const { access_token: accessToken } = body;
                expect(typeof accessToken).toBe('string');

                const payload = { sub: user.id, username: user.username };
                const result = { access_token: await jwtService.signAsync(payload), };

                expect(accessToken === result.access_token);
            });
    });
});
