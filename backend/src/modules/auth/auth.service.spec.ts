import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '@modules/users/users.module';
import { AuthService, AUTH_SERVICE, IAuthService } from '@modules/auth/auth.service';
import { jwtConstants } from './constants';

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
            providers: [{
                provide: AUTH_SERVICE,
                useClass: AuthService
            }],
        }).compile();

        service = module.get<IAuthService>(AUTH_SERVICE);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
