export class ClientRegistrationError extends Error {
    message: string;
    constructor(message?: string) {
        super();

        this.message = message ?? 'Client registration error.';
    }
}
