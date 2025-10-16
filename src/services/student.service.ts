import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import {
  ICreateStudentInput,
  IGetStudentsFilters,
  IStudent,
  IUpdateStudentInput,
} from "@/types/student.type"

export const createStudent = async (userId: string, payload: ICreateStudentInput) => {
  const response = await axios.post<IStudent>(
    ENDPOINT.STUDENT.ID.replace(":userId", userId),
    payload,
  )

  return response.data
}

export const bulkCreateStudent = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await axios.post(ENDPOINT.STUDENT.BULK, formData)

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

export const getAllStudents = async (filters: IGetStudentsFilters): Promise<IStudent[]> => {
  const response = await axios.get(ENDPOINT.STUDENT.BASE, {
    params: filters,
  })

  return response.data
}
