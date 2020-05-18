import { isValidId, isValidStrings, isValidObject, isPropertyOf, isValidStatus } from '../util/validator';
import { User } from '../models/user';
import { Reimbursement } from '../models/reimbursement';

describe('validator', () => {

    test('should return true when isValidId is provided a valid id', () => {
        
        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(1);
        let result2 = isValidId(999999);
        let result3 = isValidId(Number('123'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidId is provided a invalid id (falsy)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(NaN);
        let result2 = isValidId(0);
        let result3 = isValidId(Number(null));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isValidId is provided a invalid id (decimal)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(3.14);
        let result2 = isValidId(0.01);
        let result3 = isValidId(Number(4.20));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isValidId is provided a invalid id (non-positive)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidId(0);
        let result2 = isValidId(-1);
        let result3 = isValidId(Number(-23));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidStrings is provided valid string(s)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidStrings('valid');
        let result2 = isValidStrings('valid', 'string', 'values');
        let result3 = isValidStrings(String('weird'), String('but valid'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidStrings is provided invalid string(s)', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidStrings('');
        let result2 = isValidStrings('some valid', '', 'but not all');
        let result3 = isValidStrings(String(''), String('still weird'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return true when isValidObject is provided valid object with no nullable props', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let date = new Date();
        let mockReimb = new Reimbursement(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        let result1 = isValidObject(mockReimb); 
        let result2 = isValidObject(new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return true when isValidObject is provided valid object with nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let date = new Date();
        let mockReimb = new Reimbursement(1, 100, date, null, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        let result1 = isValidObject(mockReimb, 'resolved'); 
        let result2 = isValidObject(new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'));

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);

    });

    test('should return false when isValidObject is provided invalid object with no nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let date = new Date();
        let mockReimb = new Reimbursement(null, 100, date, date, 'text', 'receipt', 'author-test', 'resv-test', 'pending', 'food');
        let result1 = isValidObject(mockReimb); 
        let result2 = isValidObject(new User(null, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return false when isValidObject is provided invalid object with some nullable prop(s)', () => {

        // Arrange
        expect.assertions(2);

        // Act
        let result1 = isValidObject(new User(1, null, 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin')); 
        let result2 = isValidObject(new User(1, 'aanderson', 'password', null, 'Anderson', 'aanderson@revature.com', 'Admin'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);

    });

    test('should return true when isPropertyOf is provided a known property of a given constructable type', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isPropertyOf('ers_user_id', User);
        let result2 = isPropertyOf('username', User);
        let result3 = isPropertyOf('reimb_id', Reimbursement);

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isPropertyOf is provided a unknown property of a given constructable type', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isPropertyOf('test', User);
        let result2 = isPropertyOf('test2', User);
        let result3 = isPropertyOf('test', Reimbursement);

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);

    });

    test('should return false when isPropertyOf is provided a non-constructable type', () => {

        // Arrange
        expect.assertions(4);

        // Act
        let result1 = isPropertyOf('test', {x: 'nonConstructable'});
        let result2 = isPropertyOf('test', 2);
        let result3 = isPropertyOf('test', false);
        let result4 = isPropertyOf('test', Symbol('test'));

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);  

    });

    test('should return true when isValidStatus is provided a int from 1 to 3', () => {

        // Arrange
        expect.assertions(3);

        // Act
        let result1 = isValidStatus("pending");
        let result2 = isValidStatus("approved");
        let result3 = isValidStatus("denied");

        // Assert
        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);

    });

    test('should return false when isValidStatus is provided something not 1, 2, 3', () => {

        // Arrange
        expect.assertions(4);

        // Act
        let result1 = isValidStatus("test");
        let result2 = isValidStatus("4");
        let result3 = isValidStatus(null);
        let result4 = isValidStatus("");

        // Assert
        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);  

    });

});