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
import {expressjwt as jwt} from "express-jwt"
import jwks from "jwks-rsa"
import { expressJwtSecret } from "jwks-rsa";


async function main(
    eventRepository: EventRepository, 
    classRepository: ClassesRepository,
    userRepository: UserRepository
){
    console.log('App is running....')

    // const eventExample = {
    //     date: '2025-08-26',
    //     className: 'Advance Front End',
    //     color: 'yellow',
    //     event: 'Assignment 1',
    //     isComplete: false
    // }

    // await eventRepository.addEvent(eventExample)
    // await eventRepository.deleteEvent(5)
    // await eventRepository.getEventsByDate('2025-08-26')


    // Create app
    const port = 8000
    const app = express()

    // Body parser middleware
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    // cors
    app.use(cors())

    //Auth0
    // const AUTH0_DOMAIN = "https://jaysandjay.ca.auth0.com"
    // const API_IDENTIFIER = "https://jaysandjay.calendarapi.com"

    // const checkJwt = jwt({
    //     secret: jwks.expressJwtSecret({
    //         jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
    //         cache: true,
    //         rateLimit: true,
    //     }),
    //     audience: API_IDENTIFIER,
    //     issuer: AUTH0_DOMAIN,
    //     algorithms: ["RS256"],
    //     });

    // Logger
    app.use(logger)

    //  Routes
    app.use('/api/events', createEventRouter(eventRepository))
    app.use('/api/classes', createClassRouter(classRepository))
    app.use('/api/users', createUserRouter(userRepository))

    app.get('/api/events', (req, res) => {
        console.log('get')
        res.send({msg: 'success'})
    })


    app.listen(port, () => console.log(`Server is running on port ${port}...`))

}

(async () => {
    const eventRepo = new CalendarEventRepository()
    const classRepo = new CalendarClassesRepository()
    const userRepo = new CalendarUserRepository()
    await main(eventRepo, classRepo, userRepo)
})();