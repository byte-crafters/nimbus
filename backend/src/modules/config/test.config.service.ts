import { IUserService } from '@modules/user/services/users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbUserUniqueConstraintError } from '@src/modules/errors/ErrorUniqueConstaint';
import { UserRegisterError } from '@src/modules/errors/ErrorUserRegister';
import { CannotFullfillRequestError } from '@src/modules/errors/logic/CannotFullfillRequest';
import { GenericServerError } from '@src/modules/errors/logic/GenericServerError';
import { FileStructureRepository } from '@src/modules/file-structure/file-structure.service';
import { FileSystemService } from '@src/modules/file-system/file-system.service';
import path from 'node:path';
import { IConfigService } from './dev.config.service';


@Injectable()
export class TestConfigService implements IConfigService {
    constructor() { }

    getStoragePath(): string {
        return path.join(path.resolve(process.cwd()), "_test_storage");
    }
}
