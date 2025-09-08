import express from 'express'
import { UserRepository } from '../repositories/user.base.repository'
import bcrypt from 'bcrypt'

export function createUserRouter(repository: UserRepository){
    const router = express.Router()

    // Save New User
    router.post('/', async (req, res) => {
        console.log("body", req.body)
        const email = req.body.email
        const password = await bcrypt.hash(req.body.password, 10)
        console.log(password)
        if(!email || !password){
            res.status(400).json({error: 'Missing required fields'})
            throw new Error("Cannot post, Missing required fields")
        }
        const user = {
            email,
            password
        }
        const existingUser = await repository.getExistingUser(user.email)
        console.log(existingUser)
        if(existingUser){
            res.status(500).json({msg: "User already exists"})
            return
        }
        await repository.saveUser(user)
        res.status(200).json(user)
    })

    //  Login
    router.post('/login', async (req, res) => {
        const user = req.body
        const existingUser = await repository.getExistingUser(user.email)
        if(existingUser){
            const match = await bcrypt.compare(user.password, existingUser.password)
            if(match){
                res.status(200).json({msg: 'Login successful', user: existingUser})
            }else{
                res.status(500).json({msg: 'Login failed'})
            }
        }else{
            res.status(500).json({msg: 'user does not exist'})
        }

    })

    return router
}