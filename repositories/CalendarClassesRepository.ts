import { Course } from "../types/Course";
import { ClassesRepository } from "./classes.base.repository";
import { Pool } from "pg";
import "dotenv/config"
import logger from "../util/logger";
import logError from "../util/logError";
const pool = new Pool({connectionString: process.env.CONNECTION_STRING  })

export class CalendarClassesRepository implements ClassesRepository{
    async getClasses(userId: number): Promise<object> {
        const client = await pool.connect()
        try{
            const res = await client.query('SELECT * FROM classes WHERE user_id = $1 ORDER BY id',
                [userId]
            )
            logger.debug('DB: Fetch classes', {
                rowCount: res.rows.length,
                query: "getClasses",
                rows: res.rows
            })
            return res.rows
        }catch(err){
            logError("Error fetching classes", err)
            throw err
        }finally{
            client.release()
        }
    }

    async addClass(classData: Course): Promise<void> {
        const client = await pool.connect()
        try{
            const res = await client.query(`INSERT INTO classes(name, color, user_id) VALUES($1, $2, $3) RETURNING id, name, color, user_id`,
                [classData.name, classData.color, classData.userId]
            )
            logger.debug('DB: Add class', {
                rowCount: res.rows.length,
                query: "addClass",
                rows: res.rows
            })
            return res.rows[0]
        }catch(err){
            console.error(`Error adding class`, err)
            throw err
        }finally{
            client.release()
        }
    }

    async deleteClass(id: number): Promise<void> {
        const client = await pool.connect()
        try{
            const res = await client.query('DELETE FROM classes WHERE id = $1 RETURNING *',
                [id]
            )
            logger.debug('DB: Delete class', {
                rowCount: res.rows.length,
                query: "deleteClass",
                rows: res.rows
            })
        }catch(err){
            logError(`Failed to delete class with id: ${id}`, err)
            throw err
        }finally{
            client.release()
        }
    }
}