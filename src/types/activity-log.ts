import { IPagination } from "./common.type"

export interface IActivityLog {
  title: string
  content: string
  type: "user" | "system" | "inventory" | "sales" | "order"
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date
}
export interface IActivityLogFilters extends IPagination {
  search?: string
  type?: "user" | "system" | "inventory" | "sales" | "order"
  from?: string
  to?: string
}
export interface IGetActivityLogFilters extends IPagination {}
