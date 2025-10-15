import { IProductVariant } from "./product.type"
import { IPagination } from "@/types/common.type"
import { IStudent } from "@/types/user.type"

export type IOrderStatusType = "ongoing" | "confirmed" | "completed" | "cancelled"

export interface IOrder {
  id: string
  total: number
  status: IOrderStatusType
  studentId: number
  student: IStudent
  orderItems?: IOrderItems[]
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IOrderItems {
  id: string
  quantity: number
  orderId: string
  productVariantId: string
  productVariant: IProductVariant
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IOrderFilters extends IPagination {
  from: string
  to: string
  search: string
  status: IOrderStatusType
}

export interface IUpdateOrderStatusInput {
  orderId: string
  newStatus: IOrderStatusType
  oracleInvoice?: string
}

export interface ICreateOrderItemInput {
  productVariantId: string
  quantity: number
}

export interface ICreateOrderStudentInput {
  studentNumber: string
  firstName: string
  lastName: string
  program: string
  sex: "male" | "female"
}

export interface ICreateOrderInput {
  student: ICreateOrderStudentInput
  orderItems: ICreateOrderItemInput[]
}
