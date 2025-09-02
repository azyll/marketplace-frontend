type IOrderStatusType = "ongoing" | "cancelled" | "completed";

export interface IOrder {
  id: string;
  total: number;
  status: IOrderStatusType;
  studentId: number;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
