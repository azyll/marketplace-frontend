import { IProductVariant } from "./product.type"

export type IOrderStatusType = "ongoing" | "cancelled" | "completed"

export interface IOrder {
  id: string
  total: number
  status: IOrderStatusType
  studentId: number
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
