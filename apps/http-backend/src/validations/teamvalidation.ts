import {z} from "zod"

export const teamValidation = z.object({
    name:z.string(),
    userId:z.string()
})