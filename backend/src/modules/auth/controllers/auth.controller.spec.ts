import { UsersModule } from '@modules/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { authServiceDefaultProvider, userServiceDefaultProvider } from '@src/dependencies/providers';
import { AuthController } from './auth.controller';
import { jwtConstants } from '../services/constants';

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
            providers: [authServiceDefaultProvider, userServiceDefaultProvider],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
