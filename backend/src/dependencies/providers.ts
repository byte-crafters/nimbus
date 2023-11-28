import { AuthService } from "@modules/auth/services/auth.service";

export const TYPES = {
    AUTH_SERVICE: Symbol('IAuthService'),
}

export const authServiceDefaultProvider = {
    provide: TYPES.AUTH_SERVICE,
    useClass: AuthService
}