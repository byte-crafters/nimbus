import { Test, TestingModule } from '@nestjs/testing';
import { MockUsersService, mockUsersCollection } from './users.mock-service';
import { IUserService } from './users.service';
import { TYPES } from '@src/dependencies/di';

describe('UsersService', () => {
    let usersService: IUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: TYPES.USER_SERVICE,
                useClass: MockUsersService
            }],
        }).compile();

        usersService = module.get<IUserService>(TYPES.USER_SERVICE);
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    it('should return existing user by username', async () => {
        const targetUsername = 'one';
        const searchResult = await usersService.findOne(targetUsername);

        expect(searchResult.username).toEqual(targetUsername);
    });

    it('should NOT return user by username', async () => {
        const targetUsername = 'ffqf4f';
        const searchResult = await usersService.findOne(targetUsername);

        expect(searchResult).toBeUndefined();
    });

    it('should return all users', async () => {
        jest.spyOn(usersService, 'findAll').mockImplementationOnce(async () => mockUsersCollection);
        const searchResult = await usersService.findAll();

        expect(searchResult).toEqual(expect.arrayContaining(mockUsersCollection));
    });
});
