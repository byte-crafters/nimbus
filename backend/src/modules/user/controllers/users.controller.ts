import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { IUserService } from '../services/users.service';

@Controller({
    version: '1',
    path: 'users',
})
export class UsersController {
    constructor(
        @Inject(Symbol.for('IUserService')) private usersService: IUserService
    ) { }

    @Post('find-by-username')
    async findUsersByUsername(@Body() body: {
        username: string;
    }, @Req() request: any) {
        const userId = request.user.sub;

        const { username } = body;

        const possibleUsers = await this.usersService.getUsersByUsername(username)

        return possibleUsers;
    }
}
