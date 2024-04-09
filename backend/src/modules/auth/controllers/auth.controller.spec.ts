import { UsersModule } from '@modules/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { authServiceDefaultProvider } from '@src/dependencies/providers';
import { TestConfigService } from '@src/modules/config/test.config.service';
import { FilesStructureModule } from '@src/modules/file-structure/file-structure.module';
import { FilesSystemModule } from '@src/modules/file-system/file-system.module';
import { jwtConstants } from '../services/constants';
import { AuthController } from './auth.controller';
import { AuthModule } from '../auth.module';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
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
                    provide: Symbol.for('IConfigService'),
                    useClass: TestConfigService
                },
                authServiceDefaultProvider
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    });
});
