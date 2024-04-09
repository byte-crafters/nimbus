import { PrismaClient as MongoClient, Prisma } from '@prsm/generated/prisma-mongo-client-js';

export class MongoConnection {
    /** client is one for each app instance/cluster */
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient();
    }

    get Connection() {
        return this.client;
    }
}
