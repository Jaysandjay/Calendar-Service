"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarUserRepository = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.CONNECTION_STRING });
class CalendarUserRepository {
    async getUserId(user) {
        const client = await pool.connect();
        try {
            let res = await client.query('SELECT id FROM users WHERE password = $1 AND email = $2', [user.password, user.email]);
            console.log("User ID:", res.rows[0].id);
            return res.rows[0].id;
        }
        catch (err) {
            console.error("Error finding user", err);
            throw new Error("Error finding user");
        }
        finally {
            client.release();
        }
    }
    async saveUser(user) {
        const client = await pool.connect();
        try {
            await client.query('INSERT INTO users(email, password) VALUES($1, $2)', [user.email, user.password]);
        }
        catch (err) {
            console.error("Error posting user", err);
            throw new Error("Error posting user");
        }
        finally {
            client.release();
        }
    }
    async getExistingUser(email) {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT id, email, password FROM users WHERE LOWER(email) = $1', [email.toLowerCase()]);
            return res.rows[0];
        }
        catch (err) {
            console.error("Error checking for user", err);
            throw new Error("Error checking for user");
        }
        finally {
            client.release();
        }
    }
}
exports.CalendarUserRepository = CalendarUserRepository;
