import express from "express";
import { EventRepository } from "../repositories/events.base.repository";


export function createEventRouter(repository: EventRepository){

    const router = express.Router()
        
    // GET all events
    router.get('/', async (req, res) => {
        const events = await repository.getEvents()
        
        console.log('events: ', events)
        res.status(200).json(events)
    })

        // GET events by user ID
    router.get('/:id', async (req, res) => {
        const id = parseInt(req.params.id)
        const events = await repository.getEventsByUserId(id)
        
        console.log('events: ', events)
        res.status(200).json(events)
    })
   

    // Create new event
    router.post('/', async (req, res) => {
        console.log(req.body)
        const { date, event, class_id } = req.body;

        if(!date || !class_id || !event){
            res.status(400).json({error: 'Missing required fields'})
            throw new Error("Cannot post, Missing required fields")
        }

        const newEvent ={
            date,
            event,
            isComplete:  false,
            class_id
        } 
        
        await repository.addEvent(newEvent)
        res.status(200).json(newEvent)
    })

    // Delete event by id
    router.delete('/:id', async (req, res) => {
        const id = parseInt(req.params.id)
        await repository.deleteEvent(id)
        res.status(201).json({msg: `Event with id ${id} deleted`})
    })

    // Update event completion
    router.put(`/update-completion/:id`, async (req, res) => {
        const id = parseInt(req.params.id)
        const isChecked = req.body.isComplete
        console.log(isChecked)
        await repository.updateCompletion(id, isChecked)
        res.status(204).json({msg: `Event with id ${id} was updated`})
    })

    return router
}