export class CannotCreateUserRootFolderError extends Error {
    message: string;

    constructor(message?: string) {
        super();

        this.message = message ?? 'Cannot create user root folder.';
    }
}

export class UserGrantAccessUnauthorized extends Error {
    message: string;

    constructor(message?: string) {
        super();

        this.message = message ?? 'Unauthorized try to grant access to file (you are not an owner).';
    }
}

