import { AuthService } from "@modules/auth/services/auth.service";
import { UsersService } from "@src/modules/user/services/users.service";
import { TYPES } from "./di";

export const authServiceDefaultProvider = {
    provide: TYPES.AUTH_SERVICE,
    useClass: AuthService
}

export const userServiceDefaultProvider = {
    provide: TYPES.USER_SERVICE,
    useClass: UsersService
}