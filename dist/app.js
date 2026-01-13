"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarEventRepository_1 = require("./repositories/CalendarEventRepository");
const express_1 = __importDefault(require("express"));
const events_1 = require("./routes/events");
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./middleware/logger"));
const classes_1 = require("./routes/classes");
const CalendarClassesRepository_1 = require("./repositories/CalendarClassesRepository");
const users_1 = require("./routes/users");
const CalendarUserRepository_1 = require("./repositories/CalendarUserRepository");
require("dotenv/config");
const pg_1 = require("pg");
async function main(eventRepository, classRepository, userRepository) {
    console.log('App is running....');
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
    const port = 3000;
    const app = (0, express_1.default)();
    // Body parser middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // cors
    app.use((0, cors_1.default)());
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
    app.use(logger_1.default);
    //  Routes
    app.use('/api/events', (0, events_1.createEventRouter)(eventRepository));
    app.use('/api/classes', (0, classes_1.createClassRouter)(classRepository));
    app.use('/api/users', (0, users_1.createUserRouter)(userRepository));
    app.get('/api/events', (req, res) => {
        console.log('get');
        res.send({ msg: 'success' });
    });
    //Check Connection
    try {
        const pool = new pg_1.Pool({ connectionString: process.env.CONNECTION_STRING });
        await pool.query("SELECT 1");
        console.log("Database connected successfully!");
    }
    catch (err) {
        console.error("Cannot connect to database:", err);
        process.exit(1);
    }
    app.listen(port, () => console.log(`Server is running on port ${port}...`));
}
(async () => {
    const eventRepo = new CalendarEventRepository_1.CalendarEventRepository();
    const classRepo = new CalendarClassesRepository_1.CalendarClassesRepository();
    const userRepo = new CalendarUserRepository_1.CalendarUserRepository();
    await main(eventRepo, classRepo, userRepo);
})();
