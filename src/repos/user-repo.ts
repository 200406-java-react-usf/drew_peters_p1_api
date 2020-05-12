import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
        select
            au.id, 
            au.username, 
            au.password, 
            au.first_name,
            au.last_name,
            au.email,
            ur.name as role_name
        from app_users au
        join user_roles ur
        on au.role_id = ur.id
    `;

    async getAll(): Promise<User[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} order by au.id`;
            
            let rs = await client.query(sql);
            
            return rs.rows.map(mapUserResultSet);
        
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async getById(id: number): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where au.id = $1`;
            
            let rs = await client.query(sql, [id]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    

    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where au.${key} = $1`;
            
            let rs = await client.query(sql, [val]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    
    }

    async getUserByCredentials(un: string, pw: string) {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where au.username = $1 and au.password = $2`;
            
            let rs = await client.query(sql, [un, pw]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newUser: User): Promise<User> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            let roleId = (await client.query('select id from user_roles where name = $1', [newUser.role_name])).rows[0].id;
            
            let sql = `
                insert into app_users (username, password, first_name, last_name, email, role_id) 
                values ($1, $2, $3, $4, $5, $6) returning id
            `;

            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email, roleId]);
            
            newUser.ers_user_id = rs.rows[0].id;
            
            return newUser;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedUser: User): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `
            update app_users
            set
                username = $2,
                password = $3,
                first_name = $4,
                last_name = $5
            where id = $1
        `;
        await client.query(sql, [updatedUser.ers_user_id, updatedUser.username, updatedUser.password, updatedUser.first_name, updatedUser.last_name]);
        
            
            return true;
        
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
/**
 * 
 */
    async deleteById(deletedUser: User): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    delete from app_users
                    where id = $1
                `;
                await client.query(sql, [deletedUser.ers_user_id]);
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }
}