import { IUserService } from '@modules/user/services/users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbUserUniqueConstraintError } from '@src/modules/errors/ErrorUniqueConstaint';
import { UserRegisterError } from '@src/modules/errors/ErrorUserRegister';
import { CannotFullfillRequestError } from '@src/modules/errors/logic/CannotFullfillRequest';
import { GenericServerError } from '@src/modules/errors/logic/GenericServerError';
import { FileStructureRepository, IFileStructureRepository } from '@src/modules/file-structure/file-structure.service';
import { FileSystemService, IFileSystemService } from '@src/modules/file-system/file-system.service';

export interface IAuthService {
    register(username: string, password: string): Promise<any>;
    signIn(username: string, pass: string): Promise<any>;
    getProfile(userId: string): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureService: IFileStructureRepository,
        @Inject(Symbol.for('IFileSystemService')) private fileSystem: IFileSystemService,
        private jwtService: JwtService,
    ) { }

    async register(username: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.createOne({
                password,
                username,
            });

            const payload = {
                sub: user.id,
                username: user.username,
            };

            const result = {
                access_token: await this.jwtService.signAsync(payload),
            };

            await this.fileSystem.createUserRootFolder(user.id);
            await this.fileStructureService.createUserRootFolder(user.id);

            return result;
        } catch (e: unknown) {
            if (e instanceof DbUserUniqueConstraintError) {
                if (e.fieldName === 'username') {
                    throw new UserRegisterError('Cannot register user with the same username.');
                }
            } else if (e instanceof CannotFullfillRequestError) {
                throw new GenericServerError();
            }

            throw e;
        }
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
