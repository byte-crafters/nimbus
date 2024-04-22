import { PrismaClient as MongoClient } from '@prsm/generated/prisma-mongo-client-js';
import { PrismaClient as PostgresClient } from '@prsm/generated/prisma-postgres-client-js';

import { v4 as uuidv4 } from 'uuid';

describe('Test db connectors', () => {
    const postgresClient = new PostgresClient();
    const mongoClient = new MongoClient();

    beforeEach(async () => {
        await postgresClient.user.deleteMany();
        await mongoClient.node.deleteMany();
        await mongoClient.file.deleteMany();
    });

    test('Test Postgres connector: find by email', async () => {
        const testUserDTO = {
            email: Date.now + '+admin@nimbus.dev',
            name: 'Adam',
        };

        await postgresClient.user.create({
            data: {
                email: testUserDTO.email,
                username: testUserDTO.name,
                id: uuidv4(),
            },
        });

        const postgresFindResult = await postgresClient.user.findUnique({
            where: {
                email: testUserDTO.email,
            },
        });

        expect(postgresFindResult?.email).toEqual(testUserDTO.email);
    });

    test('Test Mongo connector: find by email', async () => {
        const testNodeDTO = {
            name: '/path/to/uploaded/file',
        };

        await mongoClient.node.create({
            data: {
                parentId: 'asdf',
                name: testNodeDTO.name,
                owner: 'test-user',
            },
        });

        const mongoFindResult = await mongoClient.node.findFirst({
            where: {
                name: testNodeDTO.name,
            },
        });

        expect(mongoFindResult?.name).toEqual(testNodeDTO.name);
    });
});
