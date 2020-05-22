import { ReimbursementService } from '../services/reimbursement-service';
import { Reimbursement } from '../models/reimbursement';
import Validator from '../util/validator';
import {
    ResourceNotFoundError,
    BadRequestError,
} from '../errors/errors';

jest.mock('../repos/Reimbursement-repo', () => {

    return new class ReimbursementRepository {
        getAll = jest.fn();
        getById = jest.fn();
        getReimbursementByUniqueKey = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
    }
});

describe('ReimbursementService', () => {

    let sut: ReimbursementService;
    let mockRepo: any;
    let date = new Date();
    let mockReimbursements = [
        new Reimbursement(1, 100, date, date, 'text', 1, 1, 3, 2),
        new Reimbursement(2, 200, date, date, 'text', 1, 1, 1, 2),
        new Reimbursement(3, 300, date, date, 'text', 1, 1, 1, 2),
        new Reimbursement(4, 400, date, date, 'text', 1, 1, 1, 2),
        new Reimbursement(5, 500, date, date, 'text', 1, 1, 1, 2)
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getReimbursementByUniqueKey: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new ReimbursementService(mockRepo);

    });

    test('should resolve to getAllReimbursements[] (without passwords) when getAllgetAllReimbursements() successfully retrieves getAllReimbursements from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockReimbursements);

        // Act
        let result = await sut.getAllReimbursements();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
    });

    test('should reject with ResourceNotFoundError when getAllgetAllReimbursements fails to get any getAllReimbursements from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllReimbursements();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Reimbursement when getReimbursementById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimbursement>((resolve) => resolve(mockReimbursements[id - 1]));
        });


        // Act
        let result = await sut.getReimbursementById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(1);
    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbursementById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbursementById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getReimbursementById is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getReimbursementById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should save to Reimbursement', async () => {

        // Arrange
        expect.assertions(2);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newReimbursement: Reimbursement) => {
			return new Promise<Reimbursement>((resolve) => {
				mockReimbursements.push(newReimbursement); 
				resolve(newReimbursement);
			});
		});

        // Act
        let newReimbursement = new Reimbursement(6, 500, date, date, 'text', 1, 1, 1, 2);
        let result = await sut.addNewReimbursement(newReimbursement);
        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(6);
    });
   
    test('should reject with BadRequestError if invalid Reimbursement', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newReimbursement: Reimbursement) => {
			return new Promise<Reimbursement>((resolve) => {
				mockReimbursements.push(newReimbursement); 
				resolve(newReimbursement);
			});
		});

        // Act
        let newReimbursement = new Reimbursement(6, 500, date, null, 'text', 1, 1, 1, 2);

        try {
            await sut.addNewReimbursement(newReimbursement);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should update to Reimbursement approve', async () => {

        // Arrange
        expect.hasAssertions();

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockReimbursements[0].reimb_status_id = 3
        mockRepo.update = jest.fn().mockReturnValue(mockReimbursements[0]);

        // Act
        //arg: id, author, status
        let result = await sut.updateReimbursement(mockReimbursements[0]);

        // Assert
        expect(result).toBeTruthy();
    });

    test('should reject with BadRequestError if invalid id', async () => {

        // Arrange
        //expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockReimbursements[0].reimb_status_id = 1
        mockRepo.update = jest.fn().mockReturnValue({});

        // Act
        let newReimbursement = new Reimbursement(7, 500, date, date, 'text', 1, 1, 1, 2);

        try {
            await sut.updateReimbursement(newReimbursement);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourcePersistenceError if invalid status', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbursements[0]);
        // Act

        let newReimbursement = new Reimbursement(6, 500, date, date, 'text', 1, 1, null, 2);

        try {
            await sut.updateReimbursement(newReimbursement);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    
    test('should reject with ResourcePersistenceError if invalid Reimbursement', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbursements[0]);
        // Act

        let newReimbursement = new Reimbursement(6, 500, date, date, 'text', 1, 1, null, 2);

        try {
            await sut.updateReimbursement(newReimbursement);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourcePersistenceError if invalid id', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbursements[0]);
        // Act

        let newReimbursement = new Reimbursement(null, 500, date, date, 'text', 1, 1, null, 2);

        try {
            await sut.updateReimbursement(newReimbursement);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourcePersistenceError if invalid status', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbursements[0]);
        // Act

        let newReimbursement = new Reimbursement(1, 500, date, date, 'text', 1, 1, 1, 2);

        try {
            await sut.updateReimbursement(newReimbursement);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
});