import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import { IOrder, IOrderFilters } from "@/types/order.type"
import {
  IInventoryFilter,
  IInventoryFilterReport,
  IProduct,
  IProductListFilters,
} from "@/types/product.type"
import { IPaginatedSalesResponse } from "@/types/sales.type"
import axios from "@/utils/axios"

export const getSalesReport = async (fromDate?: string, toDate?: string) => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.REPORT.SALES, {
    params: {
      from: fromDate,
      to: toDate,
    },
  })

  return response.data
}

export const getOrderReport = async (filters: Partial<IOrderFilters>) => {
  const response = await axios.get<IPaginatedResponse<IOrder[]>>(ENDPOINT.REPORT.ORDER, {
    params: filters,
  })

  return response.data
}

export const getInventoryReport = async (filters: IInventoryFilterReport) => {
  const response = await axios.get<IPaginatedResponse<IProduct[]>>(ENDPOINT.REPORT.INVENTORY, {
    params: filters,
  })

  return response.data
}

export const getProductReport = async (filters: IInventoryFilterReport) => {
  const response = await axios.get<IPaginatedResponse<IProduct[]>>(ENDPOINT.REPORT.PRODUCT, {
    params: filters,
  })

  return response.data
}
