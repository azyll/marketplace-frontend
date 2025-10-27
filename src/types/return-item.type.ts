import { IPagination } from "./common.type"
import { IProductVariant } from "./product.type"

export interface IReturnItem {
  id: string
  reason: string
  quantity: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  productVariant: IProductVariant
}
export interface IReturnItemFilters extends IPagination {
  search?: string
  status: "archived" | "active"
}
export interface IGetReturnItemFilters extends IPagination {}
export interface ICreateReturnItemInput {
  productVariant: string
  reason: string
  quantity: number
}
