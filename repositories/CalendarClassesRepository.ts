import { Course } from "../types/Course";
import { ClassesRepository } from "./classes.base.repository";
import { Pool } from "pg";
import "dotenv/config"
const pool = new Pool({connectionString: process.env.CONNECTION_STRING  })

export class CalendarClassesRepository implements ClassesRepository{
    async getClasses(userId: number): Promise<object> {
        const client = await pool.connect()
        try{
            const res = await client.query('SELECT * FROM classes WHERE user_id = $1',
                [userId]
            )
            return res.rows
        }catch(err){
            console.error("Failed to fetch classes", err)
            throw new Error("Failed to fetch classes")
        }finally{
            client.release()
        }
    }

    async addClass(classData: Course): Promise<void> {
        const client = await pool.connect()
        try{
            await client.query(`INSERT INTO classes(name, color, user_id) VALUES($1, $2, $3)`,
                [classData.name, classData.color, classData.userId]
            )
        }catch(err){
            console.error(`Error creating class`, err)
            throw new Error('Error creating class')
        }finally{
            client.release()
        }
    }

    async deleteClass(id: number): Promise<void> {
        const client = await pool.connect()
        try{
            await client.query('DELETE FROM classes WHERE id = $1',
                [id]
            )
        }catch(err){
            console.error(`Failed to delete class with id: ${id}`, err)
            throw new Error(`Failed to delete class with id: ${id}`)
        }finally{
            client.release()
        }
    }
}