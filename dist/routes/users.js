"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUserRouter(repository) {
    const router = express_1.default.Router();
    // Save New User
    router.post('/', async (req, res) => {
        console.log("body", req.body);
        const email = req.body.email;
        const password = await bcrypt_1.default.hash(req.body.password, 10);
        console.log("Password:", password);
        console.log("email::", email);
        if (!email || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            throw new Error("Cannot post, Missing required fields");
        }
        const user = {
            email,
            password
        };
        const existingUser = await repository.getExistingUser(user.email);
        console.log(existingUser);
        if (existingUser) {
            console.log("Existing user?:", "True");
            res.status(500).json({ msg: "User already exists" });
            return;
        }
        console.log("Existing user?: False");
        await repository.saveUser(user);
        res.status(200).json(user);
    });
    //  Login
    router.post('/login', async (req, res) => {
        const user = req.body;
        const existingUser = await repository.getExistingUser(user.email);
        if (existingUser) {
            console.log("Is existing user? True");
            const match = await bcrypt_1.default.compare(user.password, existingUser.password);
            if (match) {
                console.log("isMatch?: True");
                res.status(200).json({ msg: 'Login successful', user: existingUser });
            }
            else {
                console.log("isMatch?: False");
                res.status(500).json({ msg: 'Login failed' });
            }
        }
        else {
            console.log("Is existing user? False");
            res.status(500).json({ msg: 'user does not exist' });
        }
    });
    return router;
}
