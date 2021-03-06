import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
        select
            eu.ers_user_id, 
            eu.username, 
            eu.password, 
            eu.first_name,
            eu.last_name,
            eu.email,
            ur.role_name as role_name_id
        from ers_users eu
        join ers_user_roles ur
        on eu.user_role_id = ur.role_id
    `;

// Gets a user by credentials
    async getUserByCredentials(un: string, pw: string) {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where eu.username = $1 and eu.password = $2`;
            
            let rs = await client.query(sql, [un, pw]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            console.log(e);
            
            throw new InternalServerError('Unable to retrieve the user by credentials');
        } finally {
            client && client.release();
        }

    }
    
// Gets all users 
    async getAll(): Promise<User[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} order by eu.ers_user_id`;
            
            let rs = await client.query(sql);
            
            return rs.rows.map(mapUserResultSet);
        
        } catch (e) {
            throw new InternalServerError('Unable to retrieve all users');
        } finally {
            client && client.release();
        }
    
    }

// Gets a user by the specified ID
    async getById(id: number): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where eu.ers_user_id = $1`;
            
            let rs = await client.query(sql, [id]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError('Unable to retrieve the user by ID');
        } finally {
            client && client.release();
        }
    

    }

// Gets a user by a unique key
    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `${this.baseQuery} where eu.${key} = $1`;
            
            let rs = await client.query(sql, [val]);
            
            return mapUserResultSet(rs.rows[0]);
        
        } catch (e) {
            throw new InternalServerError('Unable to retrieve the user by unique key');
        } finally {
            client && client.release();
        }
        
    
    }

// Gets a user by username
    async getByUsername(un: string): Promise<User> {

        let client: PoolClient;

        try{
            client = await connectionPool.connect();

            let sql = `${this.baseQuery} where eu.username = $1`;

            let rs = await client.query(sql, [un]);

            return mapUserResultSet(rs.rows[0]);

        } catch(e){
            throw new InternalServerError('Unable to retrieve the user by username');
        } finally{
            client && client.release();
        }

    }

// Gets a user by role
    async getByRole(role_name: string): Promise<User[]>{

        let client: PoolClient;

        try{
            client = await connectionPool.connect();

            let sql = `${this.baseQuery} where role_name = $1`;

            let rs = await client.query(sql, [role_name]);

            return rs.rows;

        } catch(e){
            throw new InternalServerError('Unable to retrieve the user by role');
        } finally{
            client && client.release();
        }

    }

// Saves a new user
    async save(newUser: User): Promise<User> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            // WIP: hacky fix since we need to make two DB calls
            let roleId = (await client.query('select role_id from ers_user_roles where role_name = $1', [newUser.role_name])).rows[0].role_id;
            
            let sql = `
                insert into ers_users (username, password, first_name, last_name, email, user_role_id) 
                values ($1, $2, $3, $4, $5, $6) returning ers_user_id
            `;

            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email, roleId]);
            
            newUser.ers_user_id = rs.rows[0].ers_user_id;
            
            return newUser;

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Unable to save the new user');
        } finally {
            client && client.release();
        }
    
    }

// Updates a user, given value restricitions
    async update(updatedUser: User): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            
            let sql = `
            update ers_users
            set
                username = $2,
                password = $3,
                first_name = $4,
                last_name = $5
            where user_role_id = $1
        `;
        await client.query(sql, [updatedUser.ers_user_id, updatedUser.username, updatedUser.password, updatedUser.first_name, updatedUser.last_name]);
        
            return true;
        
        } catch (e) {
            throw new InternalServerError('Unable to update the user');
        } finally {
            client && client.release();
        }
    
    }

// Deletes a user by ID
    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();

                let sql = `
                    delete from ers_users
                    where ers_user_id = $1
                `;
                await client.query(sql, [id]);

                return true;

            } catch (e) {
                console.log(e);
                throw new InternalServerError('Unable to delete the user');
            } finally {
                client && client.release();
            }
    }

// Checks if username is available
    async checkUsername(username: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `select * from users where username = $1`;

            let rs = await client.query(sql, [username]);

            return mapUserResultSet(rs.rows[0]);

        } catch (e) {
            throw new InternalServerError('Username already taken');
        } finally {
            client && client.release();
        }
    }

// Checks if email is available
    async checkEmail(email: string): Promise<User> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let sql = `select * from users where email = $1`;

            let rs = await client.query(sql, [email]);

            return mapUserResultSet(rs.rows[0]);

        } catch (e) {
            throw new InternalServerError('Email already in use');
        } finally {
            client && client.release();
        }
    }
}
