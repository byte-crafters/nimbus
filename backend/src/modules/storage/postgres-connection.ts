import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient as PostgresClient } from '@prsm/generated/prisma-postgres-client-js';

@Injectable({
    scope: Scope.DEFAULT
})
export class PostgresConnection extends PostgresClient {
    // static i = 0;
    constructor() {
        super();
        // console.debug('created ', PostgresConnection.i)
        // console.log()
        // PostgresConnection.i++
    }
}
