import { PrismaClient as PostgresClient, Prisma } from '@prsm/generated/prisma-postgres-client-js';

export class PostgresConnection {
    /** client is one for each app instance/cluster */
    private client: PostgresClient;

    constructor() {
        this.client = new PostgresClient();
    }

    get Connection() {
        return this.client;
    }
}
