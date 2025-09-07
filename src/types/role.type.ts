export type IRoleSystemTag = "student" | "admin" | "employee"

export interface IRole {
  id: string
  name: string
  systemTag: IRoleSystemTag
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
