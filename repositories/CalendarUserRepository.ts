import { User } from "../types/User";
import { UserRepository } from "./user.base.repository";
import { Pool } from 'pg'
import "dotenv/config"
import logger from "../util/logger";
import logError from "../util/logError";

const pool = new Pool({connectionString: process.env.CONNECTION_STRING  })

export class CalendarUserRepository implements UserRepository{
    async getUserId(user: User): Promise<number> {
        const client = await pool.connect()
        try{
            let res = await client.query('SELECT id FROM users WHERE password = $1 AND email = $2', 
                [user.password, user.email]
            )
            logger.debug('DB: Get userId', {
                rowCount: res.rows.length,
                query: "getUserId",
                rows: res.rows
            })
            return  res.rows[0].id 
        }catch(err){
            logError("Error finding user", err)
            throw err
        }finally{
            client.release()
        }
    }
    
    async saveUser(user: User): Promise<void> {
        const client = await pool.connect()
        try{
            const res = await client.query('INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
                [user.email, user.password]
            )
            logger.debug('DB: Create user', {
                rowCount: res.rows.length,
                query: "saveUser",
                rows: res.rows
            })
        }catch(err){
            logError("Error posting user", err)
            throw err
        }finally{
            client.release()
        }
    }

    async getExistingUser(email: string){
        const client = await pool.connect()
        try{
            const res = await client.query('SELECT id, email, password FROM users WHERE LOWER(email) = $1',
                [email.toLowerCase()]
            )
            logger.debug('DB: Get User', {
                rowCount: res.rows.length,
                query: "getExistingUser",
                rows: res.rows
            })
            return res.rows[0]
        }catch(err){
            logError("Error checking for user", err)
            throw err
        }finally{
            client.release()
        }
    }
}