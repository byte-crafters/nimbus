export class DbUserUniqueConstraintError extends Error {
    message: string;
    fieldName: string;

    constructor(fieldName: string) {
        super();

        this.message = 'Unique constraint error.';
        this.fieldName = fieldName;
    }
}
