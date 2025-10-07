import { Button } from "@mantine/core"
import { IconCheck, IconProgressCheck } from "@tabler/icons-react"
import { IOrder, IOrderStatusType, IUpdateOrderStatusInput } from "@/types/order.type"
import { useDisclosure } from "@mantine/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrderStatus } from "@/services/order.service"
import { ConfirmOrderActionsModal } from "@/pages/dashboard/orders/components/OrderActions/ConfirmedOrderActionsModal"
import { useMemo, useState } from "react"
import { ORDER_STATUS } from "@/constants/order"
import { notifications } from "@mantine/notifications"
import pluralize from "pluralize"
import { KEY } from "@/constants/key"
import Axios from "axios"

interface Props {
  selectedOrders?: IOrder[]
  onSuccess?: () => void
}

export const ConfirmedOrderActions = ({ selectedOrders = [], onSuccess }: Props) => {
  const [orders, setOrders] = useState<IOrder[]>(selectedOrders)
  const [activeOrderIndex, setActiveOrderIndex] = useState<number>(0)

  const remaining = useMemo(() => {
    return orders.length - (activeOrderIndex + 1)
  }, [activeOrderIndex, orders])

  const activeOrder = useMemo(() => orders[activeOrderIndex], [activeOrderIndex, orders])

  const [opened, { open, close }] = useDisclosure()

  const handleOnShowConfirmation = () => {
    open()
  }

  const handleOnCloseConfirmation = () => {
    close()
  }

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({
      studentNumber,
      payload,
    }: {
      studentNumber: number
      payload: IUpdateOrderStatusInput
    }) => updateOrderStatus(studentNumber, payload),
    onSuccess: async () => {
      notifications.show({
        title: `Completed Order`,
        message: `Successfully completed order #${activeOrder.id}`,
        color: "green",
      })

      await queryClient.invalidateQueries({ queryKey: [KEY.DASHBOARD.ORDERS] })
      await queryClient.invalidateQueries({ queryKey: [KEY.DASHBOARD.ORDER, activeOrder.id] })

      if (activeOrderIndex + 1 === orders.length) {
        handleOnCloseConfirmation()
        onSuccess?.()
      } else {
        setActiveOrderIndex((prev) => prev + 1)
      }
    },
    onError: (error: any) => {
      if (Axios.isAxiosError(error)) {
        notifications.show({
          title: "Error",
          message: error?.response?.data.message ?? "Something went wrong",
          color: "red",
        })
        return
      }

      notifications.show({
        title: "Error",
        message: error?.message ?? "Something went wrong",
        color: "red",
      })
    },
  })

  const handleOnSubmit = (salesInvoice: string) => {
    updateMutation.mutate({
      studentNumber: activeOrder.studentId,
      payload: {
        orderId: activeOrder.id,
        newStatus: ORDER_STATUS.COMPLETED as IOrderStatusType,
        oracleInvoice: salesInvoice,
      },
    })
  }

  return (
    <div>
      <ConfirmOrderActionsModal
        opened={opened}
        order={activeOrder}
        onClose={() => handleOnCloseConfirmation()}
        onSubmit={handleOnSubmit}
        loading={updateMutation.isPending}
        remaining={remaining}
      />

      <div className="flex gap-2">
        <Button color="green" onClick={() => handleOnShowConfirmation()}>
          <IconCheck size={16} className="mr-2" />
          Complete Order
        </Button>
      </div>
    </div>
  )
}
