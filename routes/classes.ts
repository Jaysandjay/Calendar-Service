import express from 'express'
import { ClassesRepository } from "../repositories/classes.base.repository";
import logError from '../util/logError';

export function createClassRouter(repository: ClassesRepository){
    const router = express.Router()

    // Get Classes
    router.get('/:id', async (req, res) =>{
        try {
            const id = parseInt(req.params.id)
            if(!id || isNaN(id)){
                logError("Invalid Id", new Error("Error fetching classes"), req)
                return res.status(400).json({error: "Error fetching classes"})
            }
            const classes = await repository.getClasses(id)
            return res.status(200).json(classes)
        }catch(err){
            logError("Error Fetching classes", err, req)
            return res.status(500).json({error: "Error fetching classes"})
        }
    })

    // Create Class
    router.post('/', async (req, res) => {
        try{
            const { name, color, userId } = req.body
            if(!name || !color || !userId){
                logError("Missing required fields", new Error("Failed to create class"), req)
                return res.status(400).json({error: 'Missing required fields'})
            }    
            const newClass = {name, color, userId}
            const createdClass = await repository.addClass(newClass)
            return res.status(200).json(createdClass)
        }catch(err){
            logError("Error creating class", err, req)
            return res.status(500).json({error: "Error creating class"})
        }
    })

    // Delete class
    router.delete('/:id', async (req, res) =>{
        try {
            const id = parseInt(req.params.id)
            if(!id || isNaN(id)){
                logError("Invalid Id", new Error("Error deleting classes"), req)
                return res.status(400).json({error: "Error deleting classes"})
            }
            await repository.deleteClass(id)
            return res.status(201).json({msg: `Event with id ${id} deleted`})
        }catch(err){
            logError("Error deleting class", err, req)
            return res.status(500).json({error: "Error deleting class"})
        }
    })

    return router
}