import { Reimbursement } from '../models/reimbursement';
import { ReimbursementRepository }  from '../repos/reimbursement-repo';
import { 
    isValidId, 
    isValidObject, 
    isEmptyObject
} from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError
} from '../errors/errors';

export class ReimbursementService {
    
    constructor(private reimbursementRepo: ReimbursementRepository) {
        this.reimbursementRepo = reimbursementRepo;
    }
    
/**
 * 
 */
    async getAllReimbursements(): Promise<Reimbursement[]> {
        
        let reimbursements = await this.reimbursementRepo.getAll();

        if (reimbursements.length == 0) {
            throw new ResourceNotFoundError();
        }
        
        return reimbursements;
    }

/**
 * 
 */
async getReimbursementByUsername(username: string) {

    const reimbs = await this.reimbursementRepo.getAllByUser(username);

    return reimbs;
}

/**
 * 
 */
    async getReimbursementById(id: number): Promise<Reimbursement> {

        try {
            let reimb = await this.reimbursementRepo.getById(id);

            if (isEmptyObject(reimb)) {
                throw new ResourceNotFoundError('No reimbursement found with that ID');
            }

            return reimb;
        } catch (e) {
            throw e;
        }
    }

/**
 * 
 */
    // async getReimbursementByUniqueKey(queryObj: any): Promise<Reimbursement> {

    //     try {
    //         let queryKeys = Object.keys(queryObj);
    //         if(!queryKeys.every(key => isPropertyOf(key, Reimbursement))) {
    //             throw new BadRequestError();
    //         }
    //         let key = queryKeys[0];
    //         let val = queryObj[key];

    //         if (key === 'reimb_id') {
    //             return await this.getReimbursementById(+val);
    //         }

    //         let reimbursement = await this.reimbursementRepo.getReimbursementByUniqueKey(key, val);

    //         if (isEmptyObject(reimbursement)) {
    //             throw new ResourceNotFoundError();
    //         }

    //         return reimbursement;

    //     } catch (e) {
    //         throw e;
    //     }
    // }

/**
 * 
 */
    async addNewReimbursement(newReimbursement: Reimbursement): Promise<Reimbursement> {
            
        try {

            if (!isValidObject(newReimbursement, 'id')) {
                throw new BadRequestError('Invalid property values found in provided reimbursement.');
            }

            const persistedReimbursement = await this.reimbursementRepo.save(newReimbursement);
            
            return persistedReimbursement;
            } catch (e) {
                throw e;
            }

    }

/**
 * 
 */
    async updateReimbursement(updatedReimbursement: Reimbursement): Promise<boolean> {
        
        try {
            if (!isValidObject(updatedReimbursement)) {
                throw new BadRequestError('One or more fields are missing');
            }
            if (!isValidId(updatedReimbursement.reimb_id)) {
                throw new BadRequestError('You did not enter a valid ID');
            }
    
            // will throw eror if no reimb is found with that ID
            await this.getReimbursementById(updatedReimbursement.reimb_id);
            
            if(updatedReimbursement.resolver_id) await this.reimbursementRepo.resolve(updatedReimbursement);
            else await this.reimbursementRepo.update(updatedReimbursement);
    
            
            return true;
        } catch (e) {
            throw e;
        }

    }

/**
 * 
 */
    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        await this.reimbursementRepo.deleteById(id);
        return true;

    }
}