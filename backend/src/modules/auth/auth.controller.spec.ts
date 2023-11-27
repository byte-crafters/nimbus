import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '@modules/users/users.module';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService, AUTH_SERVICE } from '@modules/auth/auth.service';
import { jwtConstants } from '@modules/auth/constants';

describe('AuthController', () => {
    let controller: AuthController;

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
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
