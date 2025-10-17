import { IPagination } from "./common.type"
import { IOrder } from "./order.type"

export interface ISalesFilter extends IPagination {
  from: string
  to: string
  search: string
}

export interface ISales {
  id: string
  total: number
  oracleInvoice: string
  orderId: string
  order: IOrder
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IPaginatedResponseMeta {
  currentPage?: number
  itemsPerPage?: number
  totalItems: number
  totalSales: number
}

export interface IPaginatedSalesResponse {
  message: string
  data: ISales[]
  meta: IPaginatedResponseMeta
}

export interface ISalesTrend {
  previousMonth: {
    totalSales: number
  }
  currentMonth: {
    totalSales: number
    increasePercentage?: string
    decreasePercentage?: string
  }
}
