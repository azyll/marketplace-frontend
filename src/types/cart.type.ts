import { IProductVariant } from "./product.type"

export interface ICart {
  id: number
  quantity: number
  studentId: number | null
  productVariantId: string
  productVariant: IProductVariant
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}
