export class SystemError extends Error {
    message: string;
    constructor(message: string) {
        super();

        this.message = message ?? 'System error.';
    }
}