import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import { ICreateDepartmentInput, IDepartment, IGetDepartmentFilters } from "@/types/department.type"
import axios from "@/utils/axios"

export const getDepartments = async (filters: IGetDepartmentFilters) => {
  const response = await axios.get<IPaginatedResponse<IDepartment[]>>(ENDPOINT.DEPARTMENT.BASE, {
    params: filters,
  })

  return response.data
}
export const deleteDepartment = async (departmentId: string) => {
  const response = await axios.delete(ENDPOINT.DEPARTMENT.ID.replace(":departmentId", departmentId))

  return response.data
}
export const getDepartmentById = async (departmentId: string) => {
  const response = await axios.get<IDepartment>(
    ENDPOINT.DEPARTMENT.ID.replace(":departmentId", departmentId),
  )

  return response.data
}

export const createDepartment = async (payload: ICreateDepartmentInput) => {
  const response = await axios.post<IDepartment>(ENDPOINT.DEPARTMENT.BASE, payload)

  return response.data
}

export const updateDepartment = async (departmentId: string, payload: ICreateDepartmentInput) => {
  const response = await axios.put<IDepartment>(
    ENDPOINT.DEPARTMENT.ID.replace(":departmentId", departmentId),
    payload,
  )

  return response.data
}
