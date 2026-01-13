import { CalendarEventRepository } from "./repositories/CalendarEventRepository";
import { EventRepository } from "./repositories/events.base.repository";
import express from 'express';
import { createEventRouter } from "./routes/events";
import cors from 'cors'
import logger from "./middleware/logger";
import { createClassRouter } from "./routes/classes";
import { ClassesRepository } from "./repositories/classes.base.repository";
import { CalendarClassesRepository } from "./repositories/CalendarClassesRepository";
import { createUserRouter } from "./routes/users";
import { UserRepository } from "./repositories/user.base.repository";
import { CalendarUserRepository } from "./repositories/CalendarUserRepository";
import "dotenv/config"
import { Pool } from "pg";


async function main(
    eventRepository: EventRepository, 
    classRepository: ClassesRepository,
    userRepository: UserRepository
){
    console.log('App is running....')

    // Create app
    const port = 3000
    const app = express()

    // Body parser middleware
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    // cors
    app.use(cors())
    app.use(logger)

    //  Routes
    app.use('/api/events', createEventRouter(eventRepository))
    app.use('/api/classes', createClassRouter(classRepository))
    app.use('/api/users', createUserRouter(userRepository))

    //Tester
    app.get('/api/events', (req, res) => {
        console.log('get')
        res.send({msg: 'success'})
    })
        //Check Connection
    try {
        const pool = new Pool({connectionString: process.env.CONNECTION_STRING})
        await pool.query("SELECT 1")
        console.log("Database connected successfully!");
  } catch (err) {
    console.error("Cannot connect to database:", err);
    process.exit(1); 
  }

    app.listen(port, () => console.log(`Server is running on port ${port}...`))

}

(async () => {
    const eventRepo = new CalendarEventRepository()
    const classRepo = new CalendarClassesRepository()
    const userRepo = new CalendarUserRepository()
    await main(eventRepo, classRepo, userRepo)
})();