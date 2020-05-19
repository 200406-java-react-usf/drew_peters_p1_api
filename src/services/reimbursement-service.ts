import { Reimbursement } from '../models/reimbursement';
import { ReimbursementRepository }  from '../repos/reimbursement-repo';
import { 
    isValidId, 
    isValidObject, 
    isEmptyObject,
    isValidStatus,
    isPropertyOf 
} from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourceConflictError
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
    async getAllReimbursementsByUser(id: number): Promise<Reimbursement[]> {

        let reimbursements = await this.reimbursementRepo.getAllByUser(id);
    
        if (reimbursements.length == 0) {
            throw new ResourceNotFoundError();
        }
    
        return reimbursements;
    
    }

/**
 * 
 */
    async getReimbursementById(id: number): Promise<Reimbursement> {

        try {

            if (!isValidId(id)) {
                throw new BadRequestError();
            }

            let reimbursement = {...await this.reimbursementRepo.getById(id)};

            if (isEmptyObject(reimbursement)) {
                throw new ResourceNotFoundError();
            }

            return reimbursement;

        } catch (e) {
            throw e;
        }
    }

/**
 * 
 */
    async getReimbursementByUniqueKey(queryObj: any): Promise<Reimbursement> {

        try {
            let queryKeys = Object.keys(queryObj);
            if(!queryKeys.every(key => isPropertyOf(key, Reimbursement))) {
                throw new BadRequestError();
            }
            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'reimb_id') {
                return await this.getReimbursementById(+val);
            }

            let reimbursement = await this.reimbursementRepo.getReimbursementByUniqueKey(key, val);

            if (isEmptyObject(reimbursement)) {
                throw new ResourceNotFoundError();
            }

            return reimbursement;

        } catch (e) {
            throw e;
        }
    }

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
            if (!isValidId(updatedReimbursement.reimb_id)) {
                throw new BadRequestError();
            }
            if (!isValidObject(updatedReimbursement)) {
                throw new BadRequestError();
            }
            if (!isValidStatus(updatedReimbursement.reimb_status)) {
                throw new BadRequestError();
            }
            return await this.reimbursementRepo.update(updatedReimbursement);
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