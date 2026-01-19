import { EventRepository } from "./events.base.repository";
import { Event } from "../types/Event";
import { Pool } from 'pg'
import 'dotenv/config'
import logger from "../util/logger";
import logError from "../util/logError";
const pool = new Pool({connectionString: process.env.CONNECTION_STRING })

export class CalendarEventRepository implements EventRepository {

    async addEvent(event: Event): Promise<void>{
        const client = await pool.connect()
        try{
            const res = await client.query(
                `
                INSERT INTO events(date, event, is_complete, class_id) VALUES($1, $2, $3, $4) RETURNING *
                `,
                [event.date, event.event, event.isComplete, event.class_id]
            )
            logger.debug('DB: AddEvent', {
                rowCount: res.rows.length,
                query: "getTeachers",
                rows: res.rows
            })
        }catch(err){
            logError("Error creating event", err)
            throw err
        }finally{
            client.release()
        }
    }

    async deleteEvent(id: number): Promise<void> {
        const client = await pool.connect()
        try{
            const res = await client.query(`DELETE FROM events WHERE id = $1 RETURNING *`,
                [id]
            )
            logger.debug('DB: Delete teacher', {
                rowCount: res.rows.length,
                query: "deleteTeachers",
                rows: res.rows
            })
        }catch(err){
            logError(`Error deleting event with id ${id}`, err)
            throw err
        }finally{
            client.release()
        }
    }


    async getEventsByUserId(id: number): Promise<object> {
        const client = await pool.connect()
        try{
            const res = await client.query('SELECT * FROM event_details WHERE user_id = $1',
                [id]
            )
            const events = {}
            for(const row of res.rows){

              if(!events[row.date]){
                  events[row.date] = []
              }

              const event = {
                  id: row.id,
                  class: row.class_name,
                  color: row.color,
                  event: row.event,
                  isComplete: row.is_complete
              }
                events[row.date].push(event)
            }
            logger.debug('DB: Get user Events', {
                rowCount: res.rows.length,
                query: "getEventByUserId",
                rows: res.rows
            })
            return events
        }catch(err){
            logError("Failed to fetch events", err)
            throw err
        }finally{
            client.release()
        }
    }

    async getEvents(): Promise<object> {
        const client = await pool.connect()
        try{
            const res = await client.query('SELECT * FROM event_details')
            const events = {}
            for(const row of res.rows){

              if(!events[row.date]){
                  events[row.date] = []
              }

              const event = {
                  id: row.id,
                  class: row.class_name,
                  color: row.color,
                  event: row.event,
                  isComplete: row.is_complete
              }
                events[row.date].push(event)
            }
            logger.debug('DB: Fetch events', {
                rowCount: res.rows.length,
                query: "getEvents",
                rows: res.rows
            })
            return events
        }catch(err){
            logError("Failed to fetch events", err)
            throw err
        }finally{
            client.release()
        }
    }

    async updateCompletion(id: number, value: boolean): Promise<void>{
        const client = await pool.connect()
        try{
            const res = await client.query(
                `UPDATE events SET is_complete = $2 WHERE id = $1 RETURNING *`,
                [id, value]
            )
            logger.debug('DB: Update event completion', {
                rowCount: res.rows.length,
                query: "updateCompletion",
                rows: res.rows
            })
        }catch(err){
            logError(`Error updating checked value for event with id: ${id}`, err)
            throw err
        }finally{
            client.release()
        }
    }
}