import { ENDPOINT } from "@/constants/endpoints"
import { ILoginResponse } from "@/types/auth.type"
import axios from "@/utils/axios"

export interface ILoginInput {
  username: string
  password: string
}

export const authenticateUser = async (input: ILoginInput) => {
  return axios.post<ILoginResponse>(ENDPOINT.LOGIN, input)
}
