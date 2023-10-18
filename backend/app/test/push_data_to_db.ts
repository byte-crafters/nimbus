import { PrismaClient as MongoClient } from '../../prisma/generated/prisma-mongo-client-js';
import { PrismaClient as PostgresClient } from '../../prisma/generated/prisma-postgres-client-js';

(async () => {
    const postgresClient = new PostgresClient();

    await postgresClient.user.create({
        data: {
            email: "admin@nimbus.dev",
            name: "Adam"
        }
    });

    const postgresFindResult = await postgresClient.user.findMany();
    console.log(postgresFindResult);

    const mongoClient = new MongoClient();
    await mongoClient.node.create({
        data: {
            name: "/path/to/uploaded/file"
        }
    });

    const mongoFindResult = await mongoClient.node.findMany();
    console.log(mongoFindResult);
})();