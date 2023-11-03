import { Injectable } from '@nestjs/common';
import { User } from './User';

@Injectable()
export class UsersService {
    async findOne(username: string): Promise<User | null> {
        return new User({ password: 'pass', username: 'artishake' });
    }
}
