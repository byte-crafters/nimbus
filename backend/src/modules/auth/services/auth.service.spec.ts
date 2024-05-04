import { UsersModule } from '@modules/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES, authServiceDefaultProvider, userServiceDefaultProvider } from '@src/dependencies/providers';
import { jwtConstants } from './constants';
import { IAuthService } from './auth.service';
import { DataRepository } from '@src/modules/file-structure/file-structure.service';
import { FilesStructureModule } from '@src/modules/file-structure/file-structure.module';
import { FileSystemService } from '@src/modules/file-system/file-system.service';
import { FilesSystemModule } from '@src/modules/file-system/file-system.module';
import { TestConfigService } from '@src/modules/config/test.config.service';

describe('AuthService', () => {
    let service: IAuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                FilesStructureModule,
                FilesSystemModule,
                UsersModule,
                JwtModule.register({
                    global: true,
                    secret: jwtConstants.secret,
                    signOptions: { expiresIn: '60s' },
                }),
            ],
            providers: [
                {
                    provide: Symbol.for('IFileStructureRepository'),
                    useClass: DataRepository,
                },
                {
                    provide: Symbol.for('IFileSystemService'),
                    useClass: FileSystemService,
                },
                {
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService,
                },
                userServiceDefaultProvider,
                authServiceDefaultProvider,
            ],
        }).compile();

        service = module.get<IAuthService>(TYPES.AUTH_SERVICE);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    });
});
