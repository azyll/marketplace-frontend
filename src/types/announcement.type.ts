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
  image: File | null
  title?: string | null
  message?: string | null
  productId?: string | null
}
export type IUpdateAnnouncementInput = Partial<ICreateAnnouncementInput>

export interface IGetAnnouncementFilters {
  all?: boolean
  status?: "active" | "archived"
}
