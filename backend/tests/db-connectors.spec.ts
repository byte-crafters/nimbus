import { PrismaClient as MongoClient } from '../prisma/generated/prisma-mongo-client-js';
import { PrismaClient as PostgresClient } from '../prisma/generated/prisma-postgres-client-js';

describe('Test db connectors', () => {
    test('Test Postgres connector: find by email', async () => {
        const postgresClient = new PostgresClient();

        const testUserDTO = {
            email: (Date.now) + '+admin@nimbus.dev',
            name: 'Adam'
        };

        await postgresClient.user.create({
            data: {
                email: testUserDTO.email,
                name: testUserDTO.name
            }
        });

        const postgresFindResult = await postgresClient.user.findUnique({
            where: {
                email: testUserDTO.email
            }
        });

        expect(postgresFindResult?.email).toEqual(testUserDTO.email);
    });

    test('Test Mongo connector: find by email', async () => {
        const mongoClient = new MongoClient();

        const testNodeDTO = {
            name: "/path/to/uploaded/file"
        };

        await mongoClient.node.create({
            data: {
                name: testNodeDTO.name
            }
        });

        const mongoFindResult = await mongoClient.node.findFirst({
            where: {
                name: testNodeDTO.name
            }
        });

        expect(mongoFindResult?.name).toEqual(testNodeDTO.name);
    });
});