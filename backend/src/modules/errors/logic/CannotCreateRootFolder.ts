export class CannotCreateUserRootFolderError extends Error {
    message: string;

    constructor(message?: string) {
        super();

        this.message = message ?? 'Cannot create user root folder.';
    }
}