import { IPagination } from "./common.type"
import { IDepartment } from "./department.type"

export interface IProductListFilters extends IPagination {
  department?: string
  latest?: boolean
  name?: string
  category?: string
  sex?: "male | female"
  search?: string
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
  stockAvailable: number
}

export interface IProduct {
  category: string
  departmentId: string
  department: IDepartment
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

export interface ICreateProductVariantInput {
  name: string
  productAttributeId: string
  size: string
  price: number
  stockQuantity: number
}

export interface ICreateProductInput {
  name: string
  description: string
  image: File
  type: string
  category: string
  departmentId: string
  variants: ICreateProductVariantInput[]
}

export type IUpdateProductInput = Partial<ICreateProductInput>
