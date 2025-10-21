import { IPagination } from "./common.type"
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
export interface IGetDepartmentFilters extends IPagination {
  all: "true" | "false"
}

export interface IDepartmentsFilter extends IPagination {
  search?: string
}
