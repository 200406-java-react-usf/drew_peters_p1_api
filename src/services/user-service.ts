import { User } from "../models/user";
import { UserRepository } from "../repos/user-repo";
import { 
    isValidId, 
    isValidStrings, 
    isValidObject, 
    isPropertyOf, 
    isEmptyObject 
} from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    ResourcePersistenceError, 
    AuthenticationError
} from "../errors/errors";


export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }
    
/**
 * 
 */
    async authenticateUser(un: string, pw: string): Promise<User> {

        try {

            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authUser: User;
            
            authUser = await this.userRepo.getUserByCredentials(un, pw);
           
            if (isEmptyObject(authUser)) {
                throw new AuthenticationError('Bad credentials provided.');
            }

            return this.removePassword(authUser);

        } catch (e) {
            throw e;
        }

    }
    
/**
 * 
 */
    async getAllUsers(): Promise<User[]> {

        let users = await this.userRepo.getAll();

        if (users.length == 0) {
            throw new ResourceNotFoundError();
        }

        return users.map(this.removePassword);

    }

/**
 * 
 */
    async getUserById(id: number): Promise<User> {

        if (!isValidId(id)) {
            throw new BadRequestError();
        }

        let user = await this.userRepo.getById(id);

        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(user);

    }

/**
 * 
 */
    async getUserByUniqueKey(queryObj: any): Promise<User> {

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }

            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'id') {
                return await this.getUserById(+val);
            }

            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let user = await this.userRepo.getUserByUniqueKey(key, val);

            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(user);

        } catch (e) {
            throw e;
        }
    }

/**
 * 
 */
    async addNewUser(newUser: User): Promise<User> {
        
        try {

            if (!isValidObject(newUser, 'id')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newUser.username);

            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }
        
            let emailAvailable = await this.isEmailAvailable(newUser.email);
    
            if (!emailAvailable) {
                throw new  ResourcePersistenceError('The provided email is already taken.');
            }

            newUser.role_name = 'employee'; // all new registers have 'employee' role by default
            const persistedUser = await this.userRepo.save(newUser);
        
            return this.removePassword(persistedUser);

        } catch (e) {
            throw e
        }

    }

/**
 * 
 */
    async updateUser(updatedUser: User): Promise<boolean> {
        
        if (!isValidObject(updatedUser)) {
            throw new BadRequestError();
        }

        let toUpdateUser = await this.getUserById(updatedUser.ers_user_id);

        let isAvailable = await this.isUsernameAvailable(updatedUser.username);

        if(toUpdateUser.username === updatedUser.username) {
            isAvailable = true;
        }
        
        if (!isAvailable) {
            throw new ResourcePersistenceError('This username is already taken. Please pick another.');
        }

        await this.userRepo.update(updatedUser);

        return true;
    }

/**
 * 
 */
    async deleteById(id: number): Promise<boolean> {
        
        if (!isValidObject(id)) {
            throw new BadRequestError();
        }

        await this.getUserById(id);

        await this.userRepo.deleteById(id);

        return true;

    }

/**
 * 
 */
    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'username': username});
        } catch (e) {
            console.log('Username is available')
            return true;
        }

        console.log('Username is unavailable')
        return false;

    }

/**
 * 
 */
    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getUserByUniqueKey({'email': email});
        } catch (e) {
            console.log('Email is available')
            return true;
        }

        console.log('Email is unavailable')
        return false;
    }

/**
 * 
 */
    private removePassword(user: User): User {
        if(!user || !user.password) return user;
        let usr = {...user};
        delete usr.password;
        return usr;   
    }

}