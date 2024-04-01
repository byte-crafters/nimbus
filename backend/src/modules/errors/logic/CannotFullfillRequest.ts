/**
 * When we understand that we cannot fullfill user needs and must return 500
 */
export class CannotFullfillRequestError extends Error {
    message: string;
    constructor(message?: string) {
        super();

        this.message = message ?? 'Cannot fullfill request.';
    }
}
