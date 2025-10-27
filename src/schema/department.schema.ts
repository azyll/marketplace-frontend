import { z } from "zod"

export const createDepartmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  acronym: z.string().min(1, { message: "Acronym is required" }),
})

export const updateDepartmentSchema = createDepartmentSchema
