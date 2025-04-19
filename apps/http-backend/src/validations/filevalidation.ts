import { z } from "zod"

export const fileValidation = z.object({
    name:z.string(),
    teamId:z.string()
})