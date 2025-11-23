import { Module } from "@/constants/dashboard-modules"
import { IPagination } from "@/types/common.type"

export type IRoleSystemTag = "student" | "admin" | "employee"

export interface IRole {
  id: string
  name: string
  systemTag: IRoleSystemTag
  modulePermission: IRoleAccessModule[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}



export interface IRoleAccessModule {
  module: Module
  permission: "view" | "edit"
}

export interface IRoleFilters extends IPagination {
  search?: string
}
export interface IGetRolesFilters extends IPagination {}
export interface ICreateRoleInput {
  name: string
  systemTag: IRoleSystemTag
  modulePermission: IRoleAccessModule[]
}
export type IUpdateRoleInput = Partial<ICreateRoleInput>
