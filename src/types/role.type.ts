import { IPagination } from "@/types/common.type"

export type IRoleSystemTag = "student" | "admin" | "employee"

export interface IRole {
  id: string
  name: string
  systemTag: IRoleSystemTag
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export interface IRoleFilters extends IPagination {
  search?: string
}
export interface IGetRolesFilters extends IPagination {}
