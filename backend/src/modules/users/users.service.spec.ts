import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, mockUsersCollection } from './users.service';

describe('UsersService', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
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
