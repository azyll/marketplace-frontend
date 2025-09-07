import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import { ICreateStudentInput, IUpdateStudentInput } from "@/types/student.type"
import { IStudent } from "@/types/user.type"

export const createStudent = async (userId: string, payload: ICreateStudentInput) => {
  const response = await axios.post<IStudent>(
    ENDPOINT.STUDENT.USER_ID.replace(":userId", userId),
    payload,
  )

  return response.data
}

export const updateStudent = async (studentId: string, payload: IUpdateStudentInput) => {
  const response = await axios.put<IStudent>(
    ENDPOINT.STUDENT.ID.replace(":studentId", studentId),
    payload,
  )

  return response.data
}

export const deleteStudent = async (studentId: string) => {
  const response = await axios.delete(ENDPOINT.STUDENT.ID.replace(":studentId", studentId))

  return response.data
}
