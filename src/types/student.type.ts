export type IStudentLevel = "tertiary" | "shs"
export type IStudentSex = "male" | "female"

export interface ICreateStudentInput {
  programId: string
  level: IStudentLevel
  sex: IStudentSex
  id: string | number // Student ID
}

export type IUpdateStudentInput = Partial<ICreateStudentInput>
