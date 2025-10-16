import { ENDPOINT } from "@/constants/endpoints"
import { IPagination, IResponse } from "@/types/common.type"
import { IPaginatedSalesResponse, ISales, ISalesFilter, ISalesTrend } from "@/types/sale.type"
import axios from "@/utils/axios"

//Get All Sales
export const getSales = async (filters: Partial<ISalesFilter>) => {
  const response = await axios.get<IPaginatedSalesResponse>(ENDPOINT.SALES.BASE, {
    params: filters,
  })

  return response.data
}

//Get Sale
export const getSale = async (oracleInvoice: string) => {
  const response = await axios.get<IResponse<ISales>>(
    ENDPOINT.SALES.ID.replace(":salesId", oracleInvoice),
  )

  return response.data
}

//Get Sale by Order ID
export const getSaleByOrder = async (orderId: string) => {
  const response = await axios.get<IResponse<ISales>>(
    ENDPOINT.SALES.ORDERID.replace(":orderId", orderId),
  )

  return response.data
}

//Chart Data
export const getAnnualSales = async () => {
  const response = await axios.get(ENDPOINT.SALES.ANNUAL)

  return response
}

export const getSalesPerDepartment = async () => {
  const response = await axios.get(ENDPOINT.SALES.DEPARTMENT)

  return response
}

export const getSalesTrend = async () => {
  const response = await axios.get<IResponse<ISalesTrend>>(ENDPOINT.SALES.TREND)

  return response
}
