import { Reimbursement } from '../models/reimbursement';
import { CrudRepository } from './crud-repo';
import { InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapReimbursementResultSet } from '../util/result-set-mapper';

export class ReimbursementRepository implements CrudRepository<Reimbursement> {

    baseQuery = `
        select
            ar.id, 
            ar.amount, 
            ar.submitted, 
            ar.resolved,
            ar.description,
            ar.receipt,
            ar.author_id,
            ar.resolver_id,
            ar.reimb_status_id,
            ar.reimb_type_id
        from app_reimbursements ar
    `;

// Gets all items 
    async getAll(): Promise<Reimbursement[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery}`;
            
            let rs = await client.query(sql);
            
            return rs.rows.map(mapReimbursementResultSet);
        
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to get all reimbursements');
        } finally {
            client && client.release();
        }
    }

// Gets all items from a specified user ID
    async getAllByUser(id: number): Promise<Reimbursement[]> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `${this.baseQuery} where ar.author_id = $1`;

            let rs = await client.query(sql, [id]);

            return rs.rows.map(mapReimbursementResultSet);

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to get all user ID reimbursements');
        } finally {
            client && client.release();
        }
    }

// Gets all items by the specified ID
    async getById(id: number): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where ar.id = $1`;
            
            let rs = await client.query(sql, [id]);
            
            return mapReimbursementResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError('Unable to get reimbursement by ID');
        } finally {
            client && client.release();
        }
    }

//Saves an order to a new unique ID
    async save(newReimbursement: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `
                insert into app_reimbursements (amount, submitted, resolved, description, receipt, author_id, resolver_id, reimb_status_id, reimb_type_id) 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id
            `;
            
            let rs = await client.query(sql, [newReimbursement.amount, newReimbursement.submitted, 
                                            null, newReimbursement.description, 
                                            null, newReimbursement.author_id, 
                                            null, newReimbursement.reimb_status_id, 
                                            newReimbursement.reimb_type_id]);
            return mapReimbursementResultSet(rs.rows[0]);

        } catch (e) {
            throw new InternalServerError('Unable to save new reimbursement');
        } finally {
            client && client.release();
        }
    }

//Updates an order based on a new order object
    async update(updatedReimbursement: Reimbursement): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `
                update app_reimbursement
                set amount = $2, description = $3, reimb_type_id = $4
                where app_reimbursement.id = $1;
            `;

            await client.query(sql, [updatedReimbursement.amount, updatedReimbursement.description, updatedReimbursement.reimb_type_id]);
            return true;

        } catch (e) {
            throw new InternalServerError('Unable to update reimbursement');
        } finally {
            client && client.release();
        }
    }
    
//Deletes an order by its specified ID
    async deleteById(id: number): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
                delete from app_reimbursements where id = $1
            `;

            await client.query(sql, [id]);

            return true;

        } catch (e) {
            throw new InternalServerError('Unable to delete reimbursement');
        } finally {
            client && client.release();
        }
    }
};