import { User } from "../types/User"

export interface UserRepository{
    saveUser(user: User): Promise<void>
    getUserId(user: User): Promise<number>
    getExistingUser(email: string): Promise<User>
}