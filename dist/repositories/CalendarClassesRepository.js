"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarClassesRepository = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.CONNECTION_STRING });
class CalendarClassesRepository {
    async getClasses(userId) {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM classes WHERE user_id = $1 ORDER BY id', [userId]);
            console.log("classes", res.rows);
            return res.rows;
        }
        catch (err) {
            console.error("Failed to fetch classes", err);
            throw new Error("Failed to fetch classes");
        }
        finally {
            client.release();
        }
    }
    async addClass(classData) {
        const client = await pool.connect();
        try {
            const res = await client.query(`INSERT INTO classes(name, color, user_id) VALUES($1, $2, $3) RETURNING id, name, color, user_id`, [classData.name, classData.color, classData.userId]);
            console.log(res.rows);
            return res.rows[0];
        }
        catch (err) {
            console.error(`Error creating class`, err);
            throw new Error('Error creating class');
        }
        finally {
            client.release();
        }
    }
    async deleteClass(id) {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM classes WHERE id = $1', [id]);
        }
        catch (err) {
            console.error(`Failed to delete class with id: ${id}`, err);
            throw new Error(`Failed to delete class with id: ${id}`);
        }
        finally {
            client.release();
        }
    }
}
exports.CalendarClassesRepository = CalendarClassesRepository;
