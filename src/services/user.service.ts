import { IGetUserFilter, IUser } from "@/types/user.type"
import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"

export const getLoggedInUser = async () => {
  return axios.get<IUser>("/me")
}

export const getUsers = async (filters: IGetUserFilter) => {
  try {
    const response = await axios.get<IPaginatedResponse<IUser[]>>(ENDPOINT.USER.BASE, {
      params: filters,
    })

    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const postUsers = async () => {
  try {
    const response = await axios.post("/api/user")
  } catch (error) {
    console.log(error)
  }
}

export const updateUser = async (data: Partial<IUser>) => {
  try {
    const response = await axios.put<IUser>("/api/user", data)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
