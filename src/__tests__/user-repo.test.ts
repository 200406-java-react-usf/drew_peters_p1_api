import { UserRepository } from '../repos/user-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { User } from '../models/user';
import { Role } from '../models/role';


jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

describe('userRepo', () => {

    let sut = new UserRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'aanderson',
                                password: 'password',
                                first_name: 'Alice',
                                last_name: 'Anderson',
                                email: 'aanderson@revature.com',
                                role_id: 1
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a User object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);

    });

    test('Should resolve to a User object when getUserByUniqueKey retrieves a record given a valid unique key.', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.getUserByUniqueKey('username', 'un');

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to a User object when getUserByCredentials retrieves a record given a valid username and password.', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.getUserByCredentials('un', 'pw');

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to a User object when save retrieves a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(6, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.save(mockUser);

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to true when deleteById deletes a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });

    test('Should resolve to true when update updates a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', 'locked');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.update(mockUser);

        expect(result).toBeTruthy();
    });

});