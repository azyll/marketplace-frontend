import { z } from "zod"

export const createStudentSchema = z.object({
  programId: z.string().min(1, { message: "Program is required." }),
  level: z.enum(["tertiary", "shs"]),
  id: z.string().min(1, { message: "Student ID is required." }),
  sex: z.enum(["male", "female"], { message: "Sex is required." }),
})
