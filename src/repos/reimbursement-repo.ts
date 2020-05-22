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
        eu2.username as resolver_id,
        rs.reimb_status as reimb_status_id,
        rt.reimb_type as reimb_type_id
    from ers_reimbursements as er
    join ers_reimb_statuses rs 
    on er.reimb_status_id = rs.reimb_status_id
    join ers_reimb_types rt
    on er.reimb_type_id = rt.reimb_type_id 
    join ers_users eu
    on er.author_id = eu.ers_user_id 
    left join ers_users eu2
    on er.resolver_id = eu2.ers_user_id
    `;


// Gets all items 
    async getAll(): Promise<Reimbursement[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} order by reimb_status_id desc`;
            
            let rs = await client.query(sql);
            
            // console.log(rs.rows.map(mapReimbursementResultSet));
            return rs.rows;
            
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to get all reimbursements');
        } finally {
            client && client.release();
        }
    }

// Gets all items from a specified user ID
    async getAllByUser(username: string): Promise<Reimbursement[]> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `${this.baseQuery} where eu.username = $1`;

            let rs = await client.query(sql, [username]);

            return rs.rows;

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
    // async getReimbursementByUniqueKey(key: string, val: any): Promise<Reimbursement> {
    //     let client: PoolClient;

    //     try {
    //         client = await connectionPool.connect();

    //         let sql = `${this.baseQuery} where er.${key} = $1`;

    //         let rs = await client.query(sql, [val]);

    //         return mapReimbursementResultSet(rs.rows[0]);
            
    //     } catch (e) {
    //         throw new InternalServerError('Unable to get reimbursement by Unique Key');
    //     } finally {
    //         client && client.release();
    //     }
    // }

// Saves a new reimbursement
    async save(newReimbursement: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `
                insert into ers_reimbursements (amount, submitted, description, author_id, reimb_status_id, reimb_type_id) 
                values ($1, CURRENT_TIMESTAMP, $2, $3, 1, $4) returning reimb_id
            `;
            
            let rs = await client.query(sql, 
                [newReimbursement.amount, 
                 newReimbursement.description, 
                 newReimbursement.author_id, 
                 newReimbursement.reimb_type_id]);

            newReimbursement.reimb_id = rs.rows[0].ers_reimb_id;

            return newReimbursement;

        } catch (e) {
            throw new InternalServerError('Unable to save new reimbursement');
        } finally {
            client && client.release();
        }
    }
// Resolves a reimbursement
    async resolve(updatedReimbursement: Reimbursement): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `
                update ers_reimbursements
                set
                    resolved = CURRENT_TIMESTAMP,
                    resolver_id = $2,
                    reimb_status_id = $3
                where reimb_id = $1
            `;
            let rs = await client.query(sql, [updatedReimbursement.reimb_id, updatedReimbursement.resolver_id, updatedReimbursement.reimb_status_id]);
            return true;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to resolve reimbursement');
        } finally {
            client && client.release();
        }
    }

// Updates a reimbursement, given value restricitions
    async update(updatedReimbursement: Reimbursement): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    update reimbursements
                    set
                        amount = $2,
                        submitted = CURRENT_TIMESTAMP,
                        description = $3,
                        reimb_type_id = $4
                    where reimb_id = $1
                `;
                let rs = await client.query(sql, [updatedReimbursement.reimb_id, updatedReimbursement.amount, updatedReimbursement.description, updatedReimbursement.reimb_type_id]);
                return true;
            } catch (e) {
                throw new InternalServerError();
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