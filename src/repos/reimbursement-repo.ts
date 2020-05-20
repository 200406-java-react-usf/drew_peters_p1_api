import { Reimbursement } from '../models/reimbursement';
import { CrudRepository } from './crud-repo';
import { InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapReimbursementResultSet } from '../util/result-set-mapper';

export class ReimbursementRepository implements CrudRepository<Reimbursement> {

    baseQuery =  `
    select 
        er.reimb_id,
        er.amount,
        er.submitted,
        er.resolved,
        er.description,
        eu.username as author_id,
        eu.username as resolver_id,
        rs.reimb_status as reimb_status_id,
        rt.reimb_type as reimb_type_id
    from 
        ers_reimbursements as er
    join 
        ers_users as eu on er.author_id = eu.ers_user_id
    join 
    	ers_users as eu2 on er.resolver_id = eu2.ers_user_id 
    join 
        ers_reimb_statuses as rs on er.reimb_status_id = rs.reimb_status_id
    join 
        ers_reimb_types as rt on er.reimb_type_id = rt.reimb_type_id
    `;


// Gets all items 
    async getAll(): Promise<Reimbursement[]> {
        console.log('Made it this far in Repos');

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery}`;
            console.log('Made it this far in Repos 2');
            
            let rs = await client.query(sql);
            
            console.log(rs.rows.map(mapReimbursementResultSet));
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

            let sql = `${this.baseQuery} where er.author_id = $1`;

            let rs = await client.query(sql, [id]);

            return rs.rows.map(mapReimbursementResultSet);

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to get all reimbursements by user ID');
        } finally {
            client && client.release();
        }
    }

// Gets a reimbursement by the specified ID
    async getById(id: number): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where er.reimb_id = $1`;
            
            let rs = await client.query(sql, [id]);
            
            return mapReimbursementResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError('Unable to get the reimbursement by ID');
        } finally {
            client && client.release();
        }
    }

// Gets a reimbursement by a unique key
    async getReimbursementByUniqueKey(key: string, val: any): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `${this.baseQuery} where er.${key} = $1`;

            let rs = await client.query(sql, [val]);

            return mapReimbursementResultSet(rs.rows[0]);
            
        } catch (e) {
            throw new InternalServerError('Unable to get reimbursement by Unique Key');
        } finally {
            client && client.release();
        }
    }

// Saves a new reimbursement
    async save(newReimbursement: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let reimb_type_id = (await client.query('select reimb_type_id from ers_reimb_types where reimb_type = $1', [newReimbursement.reimb_type])).rows[0].reimb_type_id;
            let author_id = (await client.query('select author_id from ers_users where username = $1', [newReimbursement.author])).rows[0].ers_user_id;
            
            let sql = `
                insert into ers_reimbursements (amount, submitted, resolved, description, author_id, reimb_type_id) 
                values ($1, $2, $3, $4, $5, $6) returning reimb_id
            `;
            
            let rs = await client.query(sql,
                [
                    newReimbursement.reimb_id,
                    newReimbursement.amount,
                    newReimbursement.submitted,
                    newReimbursement.resolved,
                    newReimbursement.description,
                    null,
                    author_id,
                    null,
                    1,
                    reimb_type_id]);

            newReimbursement.reimb_id = rs.rows[0].ers_reimb_id;

            return newReimbursement;

        } catch (e) {
            throw new InternalServerError('Unable to save new reimbursement');
        } finally {
            client && client.release();
        }
    }

// Updates a reimbursement, given value restricitions
    async update(updatedReimbursement: Reimbursement): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let reimb_status_id = (await client.query('select reimb_status_id from ers_reimb_statuses where reimb_status = $1', [updatedReimbursement.reimb_status])).rows[0].reimb_status_id;
            let reimb_type_id = (await client.query('select reimb_type_id from ers_reimb_types where reimb_type = $1', [updatedReimbursement.reimb_type])).rows[0].reimb_type_id;
            let author_id = (await client.query('select author_id from ers_users where username = $1', [updatedReimbursement.author])).rows[0].ers_user_id;
            let resolver_id = (await client.query('select resolver_id from ers_users where username = $1', [updatedReimbursement.author])).rows[0].ers_user_id;

            let sql = `update ers_reimbs set reimbname = $2 password = $3 first_name = $4 last_name = $5 email = $6  reimb_role_id = $7 where reimb_role_id = $1`;
            
            let rs = await client.query(sql,
                [
                    updatedReimbursement.reimb_id,
                    updatedReimbursement.amount,
                    updatedReimbursement.submitted,
                    updatedReimbursement.resolved,
                    updatedReimbursement.description,
                    updatedReimbursement.receipt,
                    author_id,
                    resolver_id,
                    reimb_status_id,
                    reimb_type_id
                ]);

            return true;

        } catch (e) {
            throw new InternalServerError('Unable to update reimbursement');
        } finally {
            client && client.release();
        }
    }
    
// Deletes a reimbursement by ID
    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `delete from ers_reimbs where reimb_id = $1`;

            let rs = await client.query(sql, [id]);

            return true;

        } catch (e) {
            throw new InternalServerError('Unable to delete reimbursement by ID');
        } finally {
            client && client.release();
        }
    }
};