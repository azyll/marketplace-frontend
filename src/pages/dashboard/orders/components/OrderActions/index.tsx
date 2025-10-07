import { IOrder, IOrderStatusType } from "@/types/order.type"
import { ORDER_STATUS } from "@/constants/order"
import { OngoingOrderActions } from "./OngoingOrderActions"
import { ConfirmedOrderActions } from "./ConfirmedOrderActions"

interface Props {
  status: IOrderStatusType
  selectedOrders: IOrder[]
}
export const OrderActions = ({ status, selectedOrders }: Props) => {
  if (status === ORDER_STATUS.ONGOING) {
    return <OngoingOrderActions selectedOrders={selectedOrders} />
  }

  if (status === ORDER_STATUS.CONFIRMED) {
    return <ConfirmedOrderActions selectedOrders={selectedOrders} />
  }

  return null
}
