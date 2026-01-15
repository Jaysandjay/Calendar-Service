import express from 'express'
import { ClassesRepository } from "../repositories/classes.base.repository";

export function createClassRouter(repository: ClassesRepository){
    const router = express.Router()

    // Get Classes
    router.get('/:id', async (req, res) =>{
        const id = parseInt(req.params.id)
        const classes = await repository.getClasses(id)
        console.log('Classes: ', classes)
        res.status(200).json(classes)
    })

    // Create Class
    router.post('/', async (req, res) => {
        console.log(req.body)
        const { name, color, userId } = req.body
        console.log(userId)

        if(!name || !color || !userId){
            res.status(400).json({error: 'Missing required fields'})
            throw new Error("Cannont post, Missing required fields")
        }

        const newClass = {name, color, userId}

        const createdClass =await repository.addClass(newClass)
        res.status(200).json(createdClass)
    })

    // Delete class
    router.delete('/:id', async (req, res) =>{
        const id = parseInt(req.params.id)
        await repository.deleteClass(id)
        res.status(201).json({msg: `Event with id ${id} deleted`})
    })

    return router
}