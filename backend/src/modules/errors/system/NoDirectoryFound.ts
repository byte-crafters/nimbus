import { SystemError } from '../SystemError';

export class NoDirectoryFound extends SystemError {
    message: string;
    constructor(message: string) {
        super(message);

        this.message = message ?? 'User registration error.';
    }
}
