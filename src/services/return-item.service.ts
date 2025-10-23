import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import {
  ICreateReturnItemInput,
  IGetReturnItemFilters,
  IReturnItem,
} from "@/types/return-item.type"
import axios from "@/utils/axios"

export const getReturnItems = async (filters: IGetReturnItemFilters) => {
  const response = await axios.get<IPaginatedResponse<IReturnItem[]>>(ENDPOINT.RETURN_ITEM.BASE, {
    params: filters,
  })

  return response.data
}
export const deleteReturnItem = async (returnItemId: string) => {
  const response = await axios.delete(
    ENDPOINT.RETURN_ITEM.ID.replace(":returnItemId", returnItemId),
  )

  return response.data
}

export const createReturnItem = async (payload: ICreateReturnItemInput) => {
  const response = await axios.post<IReturnItem>(ENDPOINT.RETURN_ITEM.BASE, payload)

  return response.data
}

export const updateReturnItemQuantity = async (returnItemId: string, newQuantity: number) => {
  const response = await axios.put<IReturnItem>(
    ENDPOINT.RETURN_ITEM.ID.replace(":returnItemId", returnItemId),
    { quantity: newQuantity },
  )

  return response.data
}
