import { IPagination } from "./common.type"
import { IProduct } from "./product.type"

export interface IAnnouncement {
  id: string
  image: string
  title: string | null
  message: string | null
  productId: string | null
  product: IProduct | null
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface ICreateAnnouncementInput {
  image?: File | undefined
  title?: string | null
  message?: string | null
  productId?: string | null
}
export type IUpdateAnnouncementInput = Partial<ICreateAnnouncementInput>

export interface IGetAnnouncementFilters extends IPagination {
  all?: boolean
  status?: "active" | "archived"
  search?: string
}
