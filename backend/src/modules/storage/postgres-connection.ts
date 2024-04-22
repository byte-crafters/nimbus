import { Injectable, Scope } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient as PostgresClient } from '@prsm/generated/prisma-postgres-client-js';

@Injectable({
    scope: Scope.DEFAULT
})
export class PostgresConnection extends PostgresClient {
    /** client is one for each app instance/cluster */
    // private client: PostgresClient;

    constructor() {
        super()
        // console.error('created')
        // this.client = new PostgresClient();

        // const s = new Proxy(this.client, {})

    }

    // get Connection() {
    //     return this.client;
    // }
}
