import express from 'express'
import { UserRepository } from '../repositories/user.base.repository'
import bcrypt from 'bcrypt'
import logError from '../util/logError'
import logger from '../util/logger'

export function createUserRouter(repository: UserRepository){
    const router = express.Router()

    // Save New User
    router.post('/', async (req, res) => {
        try{
            const email = req.body.email
            const password = await bcrypt.hash(req.body.password, 10)
            if(!email || !password){
                logError("Missing required Fields", new Error("Failed to save user"), req)
                res.status(400).json({error: 'Missing required fields'})
            }
            const user = {
                email,
                password
            }
            const existingUser = await repository.getExistingUser(user.email)
            if(existingUser){
                logger.debug("User already Exists")
                res.status(400).json({msg: "User already exists"})
                return
            }
            await repository.saveUser(user)
            res.status(200).json(user)
        }catch(err){
            logError("Error creating user", err, req)
            return res.status(500).json({error: "Error creating user"})
        }
    })

    //  Login
    router.post('/login', async (req, res) => {
        try{
            const user = req.body
            if(!req.body){
                logError("Missing user details", new Error("Errir logging in"), req)
                return res.status(400).json({error: "Missing user details"})
            }
            const existingUser = await repository.getExistingUser(user.email)
            if(existingUser){
                const match = await bcrypt.compare(user.password, existingUser.password)
                if(match){
                    logger.debug("isMatch?: True")
                    return res.status(200).json({msg: 'Login successful', user: existingUser})
                }else{
                    logger.debug("isMatch?: False")
                    return res.status(500).json({msg: 'Login failed'})
                }
            }else{
                logger.debug("Is existing user? False")
                return res.status(500).json({msg: 'user does not exist'})
            }
        }catch(err){
            logError("Error logging in", err, req)
            return res.status(500).json({error: "Error logging in user"})
        }

    })

    return router
}