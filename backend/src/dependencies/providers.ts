import { AuthService } from '@modules/auth/services/auth.service';
import { UsersRepository } from '@src/modules/user/services/users.service';

export const TYPES = {
    AUTH_SERVICE: Symbol.for('IAuthService'),
    // USER_SERVICE: Symbol.for('IUserService')
};

export const authServiceDefaultProvider = {
    provide: TYPES.AUTH_SERVICE,
    useClass: AuthService,
};

/**
 * TODO
 * Rename it to `databaseprovider`
 */
export const userServiceDefaultProvider = {
    provide: Symbol.for('IUserService'),
    useClass: UsersRepository,
};
