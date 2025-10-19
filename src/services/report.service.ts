import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedSalesResponse } from "@/types/sales.type"
import axios from "@/utils/axios"

export const getSalesReport = async () => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.REPORT.SALES)

  return response.data
}

export const getOrderReport = async () => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.REPORT.ORDER)

  return response.data
}

export const getInventoryReport = async () => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.REPORT.INVENTORY)

  return response.data
}

export const getProductReport = async () => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.REPORT.PRODUCT)

  return response.data
}
