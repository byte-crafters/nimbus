export class ClientUnauthorizedError extends Error {
    message: string;
    constructor(message?: string) {
        super();

        this.message = message ?? 'Handled: client unauthorized error.';
    }
}