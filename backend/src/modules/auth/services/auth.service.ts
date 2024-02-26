import { IUserService } from '@modules/user/services/users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileStructureService } from '@src/modules/files/file-structure.service';
const fs = require('node:fs');

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
        private jwtService: JwtService
    ) { }

    async register(username: string, password: string): Promise<any> {
        const user = await this.usersService.createOne({ password, username });

        const payload = {
            sub: user.id,
            username: user.username
        };

        const result = {
            access_token: await this.jwtService.signAsync(payload)
        };


        const s = await this.fileStructureService.createUserRootFolder(user.id);
        console.log(s);


        // const folderName = '/var/nimbus-files/';
        // try {
        //     if (!fs.existsSync(folderName)) {
        //         fs.mkdirSync(folderName);
        //     }
        // } catch (err) {
        //     console.error(err);
        // }

        // const folderNameUser = `/var/nimbus-files/${user.username}`;
        // try {
        //     if (!fs.existsSync(folderNameUser)) {
        //         fs.mkdirSync(folderNameUser);
        //     }
        // } catch (err) {
        //     console.error(err);
        // }

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