"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventRepository = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: 'postgresql://postgres:izadam@localhost:5432/calendar' });
class CalendarEventRepository {
    async addEvent(event) {
        const client = await pool.connect();
        console.log(event);
        try {
            await client.query(`
                INSERT INTO events(date, event, is_complete, class_id) VALUES($1, $2, $3, $4)
                `, [event.date, event.event, event.isComplete, event.class_id]);
        }
        catch (err) {
            console.error("Error inserting event", err);
            throw new Error("Error inserting Event");
        }
        finally {
            client.release();
        }
    }
    async deleteEvent(id) {
        const client = await pool.connect();
        try {
            await client.query(`DELETE FROM events WHERE id = $1`, [id]);
        }
        catch (err) {
            console.error(`Error deleting event with id ${id}`, err);
            throw new Error(`Error deleting event with id ${id}`);
        }
        finally {
            client.release();
        }
    }
    async getEventsByUserId(id) {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM event_details WHERE user_id = $1', [id]);
            console.log(res);
            const events = {};
            for (const row of res.rows) {
                if (!events[row.date]) {
                    events[row.date] = [];
                }
                const event = {
                    id: row.id,
                    class: row.class_name,
                    color: row.color,
                    event: row.event,
                    isComplete: row.is_complete
                };
                events[row.date].push(event);
            }
            return events;
        }
        catch (err) {
            console.error("Failed to fetch events", err);
            throw new Error("Failed to fetch events");
        }
        finally {
            client.release();
        }
    }
    async getEvents() {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM event_details');
            console.log(res);
            const events = {};
            for (const row of res.rows) {
                if (!events[row.date]) {
                    events[row.date] = [];
                }
                const event = {
                    id: row.id,
                    class: row.class_name,
                    color: row.color,
                    event: row.event,
                    isComplete: row.is_complete
                };
                events[row.date].push(event);
            }
            return events;
        }
        catch (err) {
            console.error("Failed to fetch events", err);
            throw new Error("Failed to fetch events");
        }
        finally {
            client.release();
        }
    }
    async updateCompletion(id, value) {
        const client = await pool.connect();
        try {
            const res = await client.query(`UPDATE events SET is_complete = $2 WHERE id = $1`, [id, value]);
        }
        catch (err) {
            console.error(`Error updating checked value for event with id: ${id}`, err);
            throw new Error(`Error updating checked value for event with id: ${id}`);
        }
        finally {
            client.release();
        }
    }
}
exports.CalendarEventRepository = CalendarEventRepository;
