import { Controller, Inject } from '@nestjs/common';
import { IUserService } from '../services/users.service';
import { TYPES } from '@src/dependencies/di';

@Controller('users')
export class UsersController {
    constructor(
        @Inject(TYPES.USER_SERVICE) private userService: IUserService
    ) { }
}
