import { Reimbursement } from '../models/reimbursement';
import { ReimbursementRepository }  from '../repos/reimbursement-repo';
import { 
    isValidId, 
    isValidObject, 
    isEmptyObject 
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
        
        if (!isValidObject(updatedReimbursement, 'id') || !isValidId(updatedReimbursement.reimb_id)) {
            throw new BadRequestError('Invalid reimbursement provided.');
        }

        let reimbToUpdate = await this.getReimbursementById(updatedReimbursement.reimb_id);

        if(updatedReimbursement.reimb_status !== 1){
            throw new ResourceConflictError('Cannot update a non-pending reimbursment');
        }

        if(updatedReimbursement.author !== reimbToUpdate.author){
            throw new ResourceConflictError('Cannot update author ID');
        }

        if(updatedReimbursement.reimb_id !== reimbToUpdate.reimb_id){
            throw new ResourceConflictError('Cannot update reimbursment ID');
        }

        if(updatedReimbursement.reimb_status !== reimbToUpdate.reimb_status){
            throw new ResourceConflictError('Cannot update status of reimbursment');
        }

        if(updatedReimbursement.receipt !== reimbToUpdate.receipt){
            throw new ResourceConflictError('Cannot update receipt of reimbursment');
        }

        if(updatedReimbursement.resolved !== reimbToUpdate.resolved){
            throw new ResourceConflictError('Cannot update resolved time');
        }

        if(updatedReimbursement.resolver !== reimbToUpdate.resolver){
            throw new ResourceConflictError('Cannot update resolver ID');
        }

        if(updatedReimbursement.submitted !== reimbToUpdate.submitted){
            throw new ResourceConflictError('Cannot update submitted time');
        }

        return await this.reimbursementRepo.update(updatedReimbursement);
    }

/**
 * 
 */
    async deleteById(id: number): Promise<boolean> {
        
        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await this.reimbursementRepo.deleteById(id);

    }
}