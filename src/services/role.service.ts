import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import { IGetRolesFilters, IRole } from "@/types/role.type"

export const getRoles = async (filters: IGetRolesFilters) => {
  try {
    const response = await axios.get<IPaginatedResponse<IRole[]>>(ENDPOINT.ROLE.BASE, {
      params: filters,
    })

    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const deleteRole = async (roleId: string) => {
  const response = await axios.delete(ENDPOINT.ROLE.ID.replace(":roleId", roleId))

  return response.data
}
