export class GenericServerError extends Error {
    message: string;
    constructor(message?: string) {
        super();

        this.message = message ?? 'Server error.';
    }
}