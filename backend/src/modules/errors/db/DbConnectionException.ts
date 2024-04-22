export class DbConnectionException extends Error {
    message: string;

    constructor(message?: string) {
        super();

        this.message = message ?? 'Db connection exception.';
    }
}
