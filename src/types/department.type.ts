import { IProgram } from "./program.type"

export interface IDepartment {
  id: string
  name: string
  acronym: string
  program: IProgram[]
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}
