import { Event } from "../types/Event"

export interface EventRepository {
    addEvent(event: Event): Promise<void>,
    deleteEvent(id: number): Promise<void>,
    getEventsByUserId(id: number): Promise<object>,
    getEvents(): Promise<object>,
    updateCompletion(id: number, value: boolean): Promise<void>
}