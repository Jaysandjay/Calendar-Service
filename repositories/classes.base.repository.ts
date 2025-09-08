import { Course } from "../types/Course"

export interface ClassesRepository{
    getClasses(userId: number): Promise<object>,
    addClass(classData: Course): Promise<void>,
    deleteClass(id: number): Promise<void>
}