import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import { IDepartment, IGetDepartmentFilters } from "@/types/department.type"
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
