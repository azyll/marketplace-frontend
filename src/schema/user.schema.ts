import { z } from "zod"

export const createUserSchema = z.object({
  firstName: z.string().min(2, { message: "First Name should have at least 2 letters" }),
  lastName: z.string().min(2, { message: "Last Name should have at least 2 letters" }),
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(6),
  roleId: z.string().min(1, { message: "Role is required." }),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(2, { message: "First Name should have at least 2 letters" }),
  lastName: z.string().min(2, { message: "Last Name should have at least 2 letters" }),
})
