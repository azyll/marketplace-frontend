export interface INotification {
  id: string
  title: string
  message: string
  type: "order" | "announcement"
  notificationReceiver: INotificationReceiver[]
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface INotificationReceiver {
  id: string
  isRead: boolean
  userId: string
  notificationId: string
  readAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

interface IPaginatedResponseMeta {
  currentPage?: number
  itemsPerPage?: number
  totalItems: number
  unread: number
}

export interface IPaginatedNotificationResponse {
  message: string
  data: INotification[]
  meta: IPaginatedResponseMeta
}

export interface ILog {
  id: number
  title: string
  content: string
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
