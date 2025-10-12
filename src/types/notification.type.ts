export interface INotification {
  id: string
  title: string
  message: string
  type: "order" | "announcement"
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface INotificationReceiver {
  id: string
  isRead: boolean
  notification: INotification
  userId: string
  notificationId: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
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
