import { UsersModule } from '@modules/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES, authServiceDefaultProvider } from '@src/dependencies/providers';
import { jwtConstants } from './constants';
import { IAuthService } from './auth.service';

describe('AuthService', () => {
    let service: IAuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UsersModule,
                JwtModule.register({
                    global: true,
                    secret: jwtConstants.secret,
                    signOptions: { expiresIn: '60s' },
                })
            ],
            providers: [authServiceDefaultProvider],
        }).compile();

        service = module.get<IAuthService>(TYPES.AUTH_SERVICE);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

});
