import express from "express";
import { EventRepository } from "../repositories/events.base.repository";
import logError from "../util/logError";


export function createEventRouter(repository: EventRepository){

    const router = express.Router()
        
    // GET all events
    router.get('/', async (req, res) => {
        try {
            const events = await repository.getEvents()
            return res.status(200).json(events)
        }catch(err){
            logError("Error fetching events", err, req)
            return res.status(500).json({error: "Error fetching events"})
        }
    })

        // GET events by user ID
    router.get('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            if(!id || isNaN(id)){
                logError("Invalid user Id", new Error("Failed to get events"), req)
                return res.status(400).json({error: "Error getting events for user"})
            }
            const events = await repository.getEventsByUserId(id)            
            return res.status(200).json(events)
        }catch(err){
            logError("Error getting events for user", err, req)
            return res.status(500).json({error: "Error getting events for user"})
        }
    })
   

    // Create new event
    router.post('/', async (req, res) => {
        try{
            const { date, event, class_id } = req.body;
    
            if(!date || !class_id || !event){
                logError("Missing required fields", new Error("Failed to create event"), req)
                return res.status(400).json({error: 'Missing required fields'})
            }
    
            const newEvent ={
                date,
                event,
                isComplete:  false,
                class_id
            } 
            
            await repository.addEvent(newEvent)
            return res.status(200).json(newEvent)
        }catch(err){
            logError("Error creating event", err, req)
            return res.status(500).json({error: "Error creating event"})
        }
    })

    // Delete event by id
    router.delete('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            if(!id || isNaN(id)){
                logError("Invalid Id", new Error("Failed to delete event"), req)
                return res.status(400).json({error: "Invalid Id"})
            }
            await repository.deleteEvent(id)
            return res.status(200).json({msg: `Event with id ${id} deleted`})
        }catch(err){
            logError("Error deleting event", err, req)
            return res.status(500).json({error: "Error deleting event"})
        }
    })

    // Update event completion
    router.put(`/update-completion/:id`, async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const isChecked = req.body.isComplete
             if(!id || isNaN(id)){
                logError("Invalid Id", new Error("Failed to update event"), req)
                return res.status(400).json({error: "Invalid Id"})
            }
            if(!req.body.isComplete || typeof req.body.isComplete != "boolean"){
                logError("Invalid Completion field", new Error("Failed to update event"), req)
                return res.status(400).json({error: "Invalid Completion field"})
            }
            await repository.updateCompletion(id, isChecked)
            return res.status(204).json({msg: `Event with id ${id} was updated`})
        }catch(err){
            logError("Error updating event", err, req)
            return res.status(500).json({error: "Error updating event"})
        }
    })

    return router
}