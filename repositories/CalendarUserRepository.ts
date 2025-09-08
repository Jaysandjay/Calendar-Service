import { User } from "../types/User";
import { UserRepository } from "./user.base.repository";
import { Pool } from 'pg'


const pool = new Pool({connectionString: 'postgresql://postgres:izadam@localhost:5432/calendar' })

export class CalendarUserRepository implements UserRepository{
    async getUserId(user: User): Promise<number> {
        const client = await pool.connect()
        try{
            await client.query('SELECT id FROM users WHERE password = $1 AND email LIKE $2', 
                [user.password, user.email]
            )
        }catch(err){
            console.error("Error finding user", err)
            throw new Error("Error finding user")
        }finally{
            client.release()
        }
        return 1
    }
    
    async saveUser(user: User): Promise<void> {
        const client = await pool.connect()
 
        try{
            await client.query('INSERT INTO users(email, password) VALUES($1, $2)',
                [user.email, user.password]
            )
        }catch(err){
            console.error("Error posting user", err)
            throw new Error("Error posting user")
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
            return res.rows[0]
        }catch(err){
            console.error("Error checking for user", err)
            throw new Error("Error checking for user")
        }finally{
            client.release()
        }
    }
}