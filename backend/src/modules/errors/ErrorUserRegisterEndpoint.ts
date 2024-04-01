export class UserRegisterEdnpointError extends Error {
    message: string;
    constructor(message: string) {
        super();

        this.message = message ?? 'Error on register api.';
    }
}
