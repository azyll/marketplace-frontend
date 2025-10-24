import {
  ICreateUserInput,
  IForgotPasswordUserInput,
  IGetUserFilter,
  IUpdateUserInput,
  IUser,
} from "@/types/user.type"
import axios from "@/utils/axios"
import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"

export const getLoggedInUser = async () => {
  return axios.get<IUser>("/me")
}

export const getUsers = async (filters: IGetUserFilter) => {
  const response = await axios.get<IPaginatedResponse<IUser[]>>(ENDPOINT.USER.BASE, {
    params: filters,
  })

  return response.data
}

export const getUserById = async (userId: string) => {
  const response = await axios.get<IUser>(ENDPOINT.USER.ID.replace(":userId", userId))

  return response.data
}

export const createUser = async (payload: ICreateUserInput) => {
  const response = await axios.post<IUser>(ENDPOINT.USER.BASE, payload)

  return response.data
}

export const updateUser = async (userId: string, payload: IUpdateUserInput) => {
  const response = await axios.put<IUser>(ENDPOINT.USER.ID.replace(":userId", userId), payload)

  return response.data
}

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(ENDPOINT.USER.ID.replace(":userId", userId))

  return response.data
}

export const updatePassword = async (
  userId: string,
  data: { oldPassword: string; newPassword: string },
) => {
  const response = await axios.post(
    `${ENDPOINT.USER.ID.replace(":userId", userId)}/update-password`,
    data,
  )

  return response.data
}
export const forgotUserPassword = async (payload: IForgotPasswordUserInput) => {
  const response = await axios.put<IUser>(ENDPOINT.USER.FORGOT_PASSWORD, payload)

  return response.data
}
// export const postUsers = async () => {
//   try {
//     const response = await axios.post("/api/user")
//   } catch (error) {
//     console.log(error)
//   }
// }
//
// export const updateUser = async (data: Partial<IUser>) => {
//   try {
//     const response = await axios.put<IUser>("/api/user", data)
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// }
