export interface IAnnouncement {
  id: string
  image: string
  createdAt: Date
  deletedAt: Date | null
  updatedAt: Date | null
}

export interface IGetAnnouncementFilters {
  all?: boolean
  status?: "active" | "archived"
}
