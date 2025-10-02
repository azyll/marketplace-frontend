import { ENDPOINT } from "@/constants/endpoints"
import {
  IOrder,
  IOrderFilters,
  IOrderStatusType,
  IUpdateOrderStatusInput,
} from "@/types/order.type"
import axios from "@/utils/axios"
import { IPaginatedResponse } from "@/types/common.type"

export const createOrder = async (
  studentId: string,
  orderItems: { productVariantId: string; quantity: number }[],
  orderType: "cart" | "buy-now",
) => {
  const response = await axios.post<IOrder>(
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

  return response.data.data
}

export const getOrder = async (orderId: string): Promise<IOrder> => {
  const response = await axios.get<IOrder>(`${ENDPOINT.ORDER.BASE}/${orderId}`)

  return response.data.data
}

export const getOrders = async (filters: Partial<IOrderFilters>) => {
  const response = await axios.get<IPaginatedResponse<IOrder[]>>(ENDPOINT.ORDER.BASE, {
    params: filters,
  })

  return response.data.data
}

export const getStudentOrders = async (
  userId: string,
  params?: {
    page?: number
    limit?: number
    status?: IOrderStatusType
  },
) => {
  const response = await axios.get(`${ENDPOINT.ORDER.STUDENT}/${userId}`, {
    params,
  })

  return response.data
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
