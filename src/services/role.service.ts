import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import { ICreateRoleInput, IGetRolesFilters, IRole, IUpdateRoleInput } from "@/types/role.type"

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

export const getRoleById = async (roleId: string) => {
  const response = await axios.get<IRole>(ENDPOINT.ROLE.ID.replace(":roleId", roleId))

  return response.data
}

export const createRole = async (payload: ICreateRoleInput) => {
  const response = await axios.post(ENDPOINT.ROLE.BASE, payload)

  return response.data
}

export const updateRole = async (roleId: string, payload: IUpdateRoleInput) => {
  const response = await axios.put(ENDPOINT.ROLE.ID.replace(":roleId", roleId), payload)

  return response.data
}
export const restoreRole = async (roleId: string) => {
  const response = await axios.put(ENDPOINT.ROLE.RESTORE.replace(":roleId", roleId))

  return response.data
}
