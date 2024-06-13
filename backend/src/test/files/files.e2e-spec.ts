import { AppModule } from '@modules/app/app.module';
import { User } from '@modules/user/models/User';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IDataRepository } from '@src/modules/file-structure/file-structure.type';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import * as fs from 'node:fs/promises';
import { IConfigService } from '@src/modules/config/dev.config.service';
import { TestConfigService } from '@src/modules/config/test.config.service';


describe('File (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let helper: IDataRepository;
    let config: IConfigService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [{
                provide: Symbol.for('IConfigService'),
                useClass: TestConfigService,
            }]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());

        jwtService = moduleFixture.get<JwtService>(JwtService);
        helper = moduleFixture.get<IDataRepository>(Symbol.for('IFileStructureRepository'));
        config = moduleFixture.get<IConfigService>(Symbol.for('IConfigService'));

        await app.init();

        await helper.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });

    it('Register new user and login afterwards', async () => {
        /** TODO need to add email in strong typing */
        const user = new User({ username: Date.now() + 'one', password: '123', email: Date.now().toString() });

        /** Register and claim access token */
        let access_token = null;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201)
            .expect(async (response: request.Response) => {
                const { access_token: accessToken } = response.body;
                expect(typeof accessToken).toBe('string');
                expect(accessToken.length).toBeGreaterThan(200);

                access_token = accessToken;
            });

        expect(access_token).not.toBeNull();


        /** Get user root folder */
        let userRootFolderId = null;
        await request(app.getHttpServer())
            .get('/files/user/folder/root')
            .set('Cookie', [`access_token=${access_token}`])
            .send()
            .expect(200)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    parentFolder: {
                        path: [],
                        removed: false,
                        parentFolderId: null
                    },
                    folders: []
                });

                userRootFolderId = result.parentFolder.id;
            });

        expect(userRootFolderId).not.toBeNull();

        /** Upload a file for user */
        await request(app.getHttpServer())
            .post('/files/upload')
            .set('Cookie', [`access_token=${access_token}`])
            .attach('files', Buffer.from('test_e2e', 'utf-8'), 'testuyyy.jpeg')
            .field('folderId', userRootFolderId)
            .expect(201)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    currentFolder: {
                        id: userRootFolderId,
                        owner: {
                            username: user.username,
                            rootFolderId: userRootFolderId
                        },
                        parentFolder: null,
                        path: []
                    },
                    folders: [],
                    files: [
                        {
                            name: 'testuyyy.jpeg',
                            extension: 'image/jpeg',
                            removed: false,
                            folderId: userRootFolderId,
                        }
                    ]
                });
            });

        /** Get file access for user */
    });

    it('Upload file with filename including cyrillic symbols.', async () => {
        const user = new User({ username: Date.now() + 'one', password: '123', email: Date.now().toString() });

        /** Register and claim access token */
        let access_token = null;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201)
            .expect(async (response: request.Response) => {
                const { access_token: accessToken } = response.body;
                expect(typeof accessToken).toBe('string');
                expect(accessToken.length).toBeGreaterThan(200);

                access_token = accessToken;
            });

        expect(access_token).not.toBeNull();


        /** Get user root folder */
        let userRootFolderId = null;
        await request(app.getHttpServer())
            .get('/files/user/folder/root')
            .set('Cookie', [`access_token=${access_token}`])
            .send()
            .expect(200)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    parentFolder: {
                        path: [],
                        removed: false,
                        parentFolderId: null
                    },
                    folders: []
                });

                userRootFolderId = result.parentFolder.id;
            });

        expect(userRootFolderId).not.toBeNull();

        /** Upload a file for user */
        await request(app.getHttpServer())
            .post('/files/upload')
            .set('Cookie', [`access_token=${access_token}`])
            .attach('files', Buffer.from('test_e2e', 'utf-8'), 'файл.jpeg')
            .field('folderId', userRootFolderId)
            .expect(201)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    currentFolder: {
                        id: userRootFolderId,
                        owner: {
                            username: user.username,
                            rootFolderId: userRootFolderId
                        },
                        parentFolder: null,
                        path: []
                    },
                    folders: [],
                    files: [
                        {
                            name: 'файл.jpeg',
                            extension: 'image/jpeg',
                            removed: false,
                            folderId: userRootFolderId,
                        }
                    ]
                });
            });

        /** Get file access for user */
    });

    it('Get uploaded file and folder info', async () => {
        const user = new User({ username: Date.now() + 'one', password: '123', email: Date.now().toString() });

        /** Register and claim access token */
        let access_token = null;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201)
            .expect(async (response: request.Response) => {
                const { access_token: accessToken } = response.body;
                expect(typeof accessToken).toBe('string');
                expect(accessToken.length).toBeGreaterThan(200);

                access_token = accessToken;
            });

        expect(access_token).not.toBeNull();


        /** Get user root folder */
        let userRootFolderId = null;
        await request(app.getHttpServer())
            .get('/files/user/folder/root')
            .set('Cookie', [`access_token=${access_token}`])
            .send()
            .expect(200)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    parentFolder: {
                        path: [],
                        removed: false,
                        parentFolderId: null
                    },
                    folders: []
                });

                userRootFolderId = result.parentFolder.id;
            });

        expect(userRootFolderId).not.toBeNull();

        /** Upload a file for user */
        let userFileId = null;
        await request(app.getHttpServer())
            .post('/files/upload')
            .set('Cookie', [`access_token=${access_token}`])
            .attach('files', Buffer.from('test_e2e', 'utf-8'), 'файл.jpeg')
            .field('folderId', userRootFolderId)
            .expect(201)
            .expect(async (response: request.Response) => {
                const result = response.body;
                // console.log(result)

                expect(result).toMatchObject({
                    currentFolder: {
                        id: userRootFolderId,
                        owner: {
                            username: user.username,
                            rootFolderId: userRootFolderId
                        },
                        parentFolder: null,
                        path: []
                    },
                    folders: [],
                    files: [
                        {
                            name: 'файл.jpeg',
                            extension: 'image/jpeg',
                            removed: false,
                            folderId: userRootFolderId,
                        }
                    ]
                });

                userFileId = result.files[0].id;
            });

        /** Get uploaded file info */
        await request(app.getHttpServer())
            .get(`/files/file/info/${userFileId}`)
            .set('Cookie', [`access_token=${access_token}`])
            .expect(async (response: request.Response) => {
                const result = response.body;

                expect(result).toMatchObject({
                    folderId: userRootFolderId,
                    id: userFileId,
                    owner: {
                        username: user.username,
                        email: user.email
                    },
                    size: 8
                });

            });
        
        
        /** Get folder info */
        await request(app.getHttpServer())
            .get(`/files/folder/info/${userRootFolderId}`)
            .set('Cookie', [`access_token=${access_token}`])
            .expect(async (response: request.Response) => {
                const result = response.body;

                expect(result).toMatchObject({
                    parentFolder: null,
                    name: null,
                    id: userRootFolderId,
                    owner: {
                        username: user.username,
                        email: user.email
                    }
                });

            });
    });

    afterEach(async () => {
        await helper.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
    });

    afterAll(async () => {
        await helper.removeAllData();
        await fs.rm(config.getStoragePath(), { recursive: true, force: true });
        await app.close();
    });
});
