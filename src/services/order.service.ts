import { ENDPOINT } from "@/constants/endpoints"
import {
  IOrder,
  IOrderFilters,
  IOrderStatusType,
  IUpdateOrderStatusInput,
} from "@/types/order.type"
import axios from "@/utils/axios"
import { IPaginatedResponse, IResponse } from "@/types/common.type"

export const createOrder = async (
  studentId: string,
  orderItems: { productVariantId: string; quantity: number }[],
  orderType: "cart" | "buy-now",
) => {
  const response = await axios.post<IResponse<IOrder>>(
    `${ENDPOINT.ORDER.BASE}/${studentId}`,
    {
      studentId,
      orderItems,
      orderType,
    },
    {
      params: {
        orderType,
      },
    },
  )

  return response.data
}

export const getOrder = async (orderId: string) => {
  const response = await axios.get<IResponse<IOrder>>(`${ENDPOINT.ORDER.BASE}/${orderId}`)

  return response.data
}

export const getOrders = async (filters: Partial<IOrderFilters>) => {
  const response = await axios.get<IPaginatedResponse<IOrder[]>>(ENDPOINT.ORDER.BASE, {
    params: filters,
  })

  return response.data
}

export const getStudentOrders = async (
  userId: string,
  params?: {
    page?: number
    limit?: number
    status?: IOrderStatusType
  },
) => {
  const response = await axios.get<IPaginatedResponse<IOrder[]>>(
    `${ENDPOINT.ORDER.STUDENT}/${userId}`,
    {
      params,
    },
  )

  return response.data
}

export const getAnnualOrders = async () => {
  const response = (await axios.get)(ENDPOINT.ORDER.ANNUAL)

  return response
}

export const updateOrderStatus = async (
  studentNumber: number,
  payload: IUpdateOrderStatusInput,
) => {
  const response = await axios.put(
    ENDPOINT.ORDER.STATUS.replace(":studentNumber", studentNumber.toString()),
    payload,
  )

  return response.data
}
