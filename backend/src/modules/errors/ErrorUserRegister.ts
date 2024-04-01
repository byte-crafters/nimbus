export class UserRegisterError extends Error {
    message: string;
    constructor(message: string) {
        super();

        this.message = message ?? 'User registration error.';
    }
}
