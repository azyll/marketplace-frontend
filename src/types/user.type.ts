import { IRole, IRoleSystemTag } from "./role.type"
import { IPagination } from "@/types/common.type"
import { IStudent } from "./student.type"

export interface IUser {
  fullName: string
  firstName: string
  lastName: string
  username: string
  roleId: string
  role: IRole
  roleSystemTag: IRoleSystemTag
  id: string
  student: IStudent
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IUserFilters extends IPagination {
  search?: string
  role?: string
}

export interface IGetUserFilter extends IPagination {}

export interface ICreateUserInput {
  firstName: string
  lastName: string
  username: string
  password: string
  roleId: string
}

export type IUpdateUserInput = Partial<Omit<ICreateUserInput, "password">>
