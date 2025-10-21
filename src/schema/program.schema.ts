import { z } from "zod"

export const createProgramSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  acronym: z.string().min(1, { message: "Acronym is required" }),
  departmentId: z.uuid().min(1, { message: "Department is required." }),
})

export const updateProgramSchema = createProgramSchema
