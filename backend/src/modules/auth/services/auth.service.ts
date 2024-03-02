import { IUserService } from '@modules/user/services/users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileStructureService } from '@src/modules/file-structure/file-structure.service';
import { FileSystemService } from '@src/modules/file-system/file-system.service';

export interface IAuthService {
    register(username: string, password: string): Promise<any>;
    signIn(username: string, pass: string): Promise<any>;
    getProfile(userId: string): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,
        @Inject(FileStructureService) private fileStructureService: FileStructureService,
        @Inject(FileSystemService) private fileSystem: FileSystemService,
        private jwtService: JwtService
    ) { }

    async register(username: string, password: string): Promise<any> {
        const user = await this.usersService.createOne({ password, username });

        const payload = {
            sub: user.id,
            username: user.username
        };

        const result = { access_token: await this.jwtService.signAsync(payload) };

        await this.fileSystem.createUserRootFolder(user.id);
        await this.fileStructureService.createUserRootFolder(user.id);

        return result;
    }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username };

        const result = {
            access_token: await this.jwtService.signAsync(payload),
        };

        return result;
    }

    async getProfile(userId: string): Promise<any> {
        const user = await this.usersService.getUserProfile(userId);
        const rootFolder = await this.fileStructureService.getUserRootFolder(userId);
        return { user, rootFolder };
    }
}