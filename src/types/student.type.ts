import { IProgram } from "./program.type"
import { IUser } from "./user.type"

export type IStudentLevel = "tertiary" | "shs"
export type IStudentSex = "male" | "female"

export interface IStudent {
  id: number
  userId: string
  user: IUser
  programId: string
  program: IProgram
  level: string
  sex: "male | female"
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface ICreateStudentInput {
  programId: string
  level: IStudentLevel
  sex: IStudentSex
  id: string | number // Student ID
}

export type IUpdateStudentInput = Partial<ICreateStudentInput>
