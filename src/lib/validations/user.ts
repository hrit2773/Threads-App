import * as z from "zod"
 
export const formSchema = z.object({
    profile_photo:z.string().url(),
    name:z.string().min(3).max(30),
    username: z.string().min(3, {
        message: "Username must be at least 2 characters.",
    }).max(30,{
        message: "Username must be at most 30 characters.",
    }),
    bio:z.string().min(3).max(1000),
})

export const searchValidation=z.object({
    searchString:z.string()
})