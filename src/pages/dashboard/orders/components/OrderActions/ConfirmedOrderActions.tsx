import { Button } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { IOrderStatusType } from "@/types/order.type"

export const ConfirmedOrderActions = () => {
  return (
    <div className="flex gap-2">
      <Button color="green">
        <IconCheck size={16} className="mr-2" />
        Complete Order
      </Button>
    </div>
  )
}
