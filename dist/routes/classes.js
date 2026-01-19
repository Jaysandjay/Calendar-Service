"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassRouter = createClassRouter;
const express_1 = __importDefault(require("express"));
function createClassRouter(repository) {
    const router = express_1.default.Router();
    // Get Classes
    router.get('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const classes = await repository.getClasses(id);
        console.log('Classes: ', classes);
        res.status(200).json(classes);
    });
    // Create Class
    router.post('/', async (req, res) => {
        console.log(req.body);
        const { name, color, userId } = req.body;
        console.log(userId);
        if (!name || !color || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            throw new Error("Cannont post, Missing required fields");
        }
        const newClass = { name, color, userId };
        const createdClass = await repository.addClass(newClass);
        res.status(200).json(createdClass);
    });
    // Delete class
    router.delete('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        await repository.deleteClass(id);
        res.status(201).json({ msg: `Event with id ${id} deleted` });
    });
    return router;
}
