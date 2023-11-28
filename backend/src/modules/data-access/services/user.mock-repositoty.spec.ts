import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository, UserRepository } from './user.repository';
import { MethodNotImplemented } from '../errors/not-implemented.error';
import { TYPES } from '@src/dependencies/di';
import { MockUserRepository } from './user.mock-repository';

describe('MockUserRepository', () => {
    let service: IUsersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: TYPES.USER_REPOSITORY,
                useClass: MockUserRepository
            }],
        }).compile();

        service = module.get<IUsersRepository>(TYPES.USER_REPOSITORY);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('`create`should throw MethodNotImplemented"', () => {
        expect(service.create).toThrowError(MethodNotImplemented)
    })

    it('`findOneById`should throw MethodNotImplemented"', () => {
        expect(service.findOneById).toThrowError(MethodNotImplemented)
    })
    
    it('`findOneByUsername`should throw MethodNotImplemented"', () => {
        expect(service.findOneByUsername).toThrowError(MethodNotImplemented)
    })

    it('`findAll`should throw MethodNotImplemented"', () => {
        expect(service.findAll).toThrowError(MethodNotImplemented)
    })
});
