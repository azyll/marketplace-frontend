import { IPagination } from "./common.type"
import { IDepartment } from "./department.type"
import { IStudentLevel } from "@/types/student.type"

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
  level: IProductStudentLevel
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface ICreateProductVariantInput {
  id?: string
  name: string
  productAttributeId: string
  size: string
  price: number
  stockQuantity: number
}

export interface IUpdateProductVariantInput extends ICreateProductVariantInput {
  id: string
}

export interface ICreateProductInput {
  name: string
  description: string
  image: File
  type: string
  category: string
  level: IProductStudentLevel
  departmentId: string
  variants: ICreateProductVariantInput[]
}

export type IUpdateProductInput = Partial<Omit<ICreateProductInput, "variants">> & {
  variants?: IUpdateProductVariantInput[]
}

export type IProductStudentLevel = IStudentLevel | "all"

//Inventory

export interface IInventoryFilter extends IPagination {
  sex?: "male" | "female"
  department?: string
  stock_condition?: "low-stock" | "in-stock" | "out-of-stock"
  name?: string
  category?: string
  search?: string
}
