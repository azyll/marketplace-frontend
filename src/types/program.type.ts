import { IDepartment } from "./department.type"
import { IPagination } from "@/types/common.type"

export interface IProgram {
  id: string
  name: string
  departmentId: string
  department: IDepartment
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IGetProgramsFilters extends IPagination {}
