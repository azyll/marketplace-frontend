import { IOrder, IOrderStatusType } from "@/types/order.type"
import { ORDER_STATUS } from "@/constants/order"
import { OngoingOrderActions } from "./OngoingOrderActions"
import { ConfirmedOrderActions } from "./ConfirmedOrderActions"

interface Props {
  status: IOrderStatusType
  selectedOrders: IOrder[]
  onSuccess?: () => void
}
export const OrderActions = ({ status, selectedOrders, onSuccess }: Props) => {
  if (status === ORDER_STATUS.ONGOING) {
    return <OngoingOrderActions selectedOrders={selectedOrders} onSuccess={onSuccess} />
  }

  if (status === ORDER_STATUS.CONFIRMED) {
    return <ConfirmedOrderActions selectedOrders={selectedOrders} onSuccess={onSuccess} />
  }

  return null
}
