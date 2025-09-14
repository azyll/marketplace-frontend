import { IPagination } from "./common.type"

export interface IProductListFilters extends IPagination {
  department?: string
  latest?: boolean
  name?: string
  category?: string
  sex?: "male | female"
}

export interface IProductAttribute {
  id: string
  name: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IProductVariant {
  id: string
  name: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
  price: number
  productAttribute: IProductAttribute
  productAttributeId: string
  productId: string
  product: IProduct
  size: string
  stockCondition: "in-stock" | "out-of-stock" | "low-stock"
  stockQuantity: number
}

export interface IProduct {
  category: string
  departmentId: string
  description: string
  id: string
  image: string
  name: string
  productSlug: string
  productVariant: IProductVariant[]
  type: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}
