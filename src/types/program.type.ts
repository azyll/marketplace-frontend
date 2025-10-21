import { IDepartment } from "./department.type"
import { IPagination } from "@/types/common.type"

export interface IProgram {
  id: string
  name: string
  acronym: string
  departmentId: string
  department: IDepartment
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IGetProgramsFilters extends IPagination {}
export interface IProgramsFilter extends IPagination {
  search?: string
  department?: string
}
export interface ICreateProgramInput {
  name: string
  acronym: string
  departmentId: string
}

export type IUpdateDepartmentInput = Partial<ICreateProgramInput>
