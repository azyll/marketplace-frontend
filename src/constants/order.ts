import { useNavigate } from "react-router"
import { DataTableColumn } from "mantine-datatable"
import { IOrder } from "@/types/order.type"

export const ORDER_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  CONFIRMED: "confirmed",
}

export const orderStatusLabel = {
  [ORDER_STATUS.ONGOING]: "On Going",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.CONFIRMED]: "confirmed",
}

export const orderStatusColor = {
  [ORDER_STATUS.ONGOING]: "yellow",
  [ORDER_STATUS.COMPLETED]: "green",
  [ORDER_STATUS.CANCELLED]: "red",
  [ORDER_STATUS.CONFIRMED]: "blue",
}
