import { IProgram } from "./program.type"
import { IRole, IRoleSystemTag } from "./role.type"
import { IPagination } from "@/types/common.type"

export interface IUser {
  fullName: string
  firstName: string
  lastName: string
  email: string
  roleId: string
  role: IRole
  roleSystemTag: IRoleSystemTag
  id: string
  student: IStudent
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IStudent {
  id: number
  userId: string
  programId: string
  program: IProgram
  level: string
  sex: "male | female"
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IGetUserFilter extends IPagination {
  // Add other user filters here
}

export interface ICreateUserInput {
  firstName: string
  lastName: string
  email: string
  password: string
  roleId: string
}

export type IUpdateUserInput = Partial<Omit<ICreateUserInput, "password">>
