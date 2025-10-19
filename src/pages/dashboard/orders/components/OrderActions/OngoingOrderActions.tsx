import { OngoingOrderActionsModal } from "./OngoingOrderActionsModal"
import { Button } from "@mantine/core"
import { IconProgressCheck } from "@tabler/icons-react"
import { IOrder, IOrderStatusType, IUpdateOrderStatusInput } from "@/types/order.type"
import { useMemo, useState } from "react"
import { useDisclosure } from "@mantine/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrderStatus } from "@/services/order.service"
import { notifications } from "@mantine/notifications"
import Axios, { AxiosError } from "axios"
import { ORDER_STATUS } from "@/constants/order"
import pluralize from "pluralize"
import { KEY } from "@/constants/key"

interface Props {
  selectedOrders?: IOrder[]
  onSuccess?: () => void
}

type ActionType = "confirm" | "cancel"

export const OngoingOrderActions = ({ selectedOrders = [], onSuccess }: Props) => {
  const [actionType, setActionType] = useState<ActionType | undefined>()

  const [opened, { open, close }] = useDisclosure()

  const handleOnShowConfirmation = (actionType: ActionType) => {
    setActionType(actionType)
    open()
  }

  const handleOnCloseConfirmation = () => {
    close()

    setTimeout(() => setActionType(undefined), 200)
  }

  const updateMutation = useMutation({
    mutationFn: ({
      studentNumber,
      payload,
    }: {
      studentNumber: number
      payload: IUpdateOrderStatusInput
    }) => updateOrderStatus(studentNumber, payload),
  })

  const infinitiveLabel = useMemo(
    () => (actionType === "cancel" ? "Cancel" : "Confirm"),
    [actionType],
  )
  const pastTenseLabel = useMemo(
    () => (actionType === "cancel" ? "Cancelled" : "Confirmed"),
    [actionType],
  )

  const queryClient = useQueryClient()

  const handleOnYes = async () => {
    try {
      await Promise.all(
        selectedOrders.map((order) => {
          const newStatus = (
            actionType === "confirm" ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.CANCELLED
          ) as IOrderStatusType

          return updateMutation.mutateAsync({
            studentNumber: order.studentId,
            payload: {
              orderId: order.id,
              newStatus,
            },
          })
        }),
      )

      notifications.show({
        title: `${infinitiveLabel} order Success`,
        message: `Successfully ${pastTenseLabel} ${selectedOrders?.length > 1 ? selectedOrders?.length : ""} ${pluralize("order", selectedOrders?.length)}`,
        color: "green",
      })

      await queryClient.invalidateQueries({ queryKey: [KEY.DASHBOARD.ORDERS] })

      await Promise.all(
        selectedOrders?.map((order) =>
          queryClient.invalidateQueries({ queryKey: [KEY.DASHBOARD.ORDER, order.id] }),
        ),
      )

      handleOnCloseConfirmation()
      onSuccess?.()
    } catch (error: any) {
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
    }
  }

  return (
    <div>
      <OngoingOrderActionsModal
        opened={opened}
        actionType={actionType}
        itemsCount={selectedOrders.length}
        onClose={() => handleOnCloseConfirmation()}
        onYes={() => handleOnYes()}
        loading={updateMutation.isPending}
        size={480}
      />

      <div className="flex gap-4">
        <Button onClick={() => handleOnShowConfirmation("confirm")}>
          <IconProgressCheck size={16} className="mr-2" />
          Confirm Order
        </Button>

        <Button variant="light" color="red" onClick={() => handleOnShowConfirmation("cancel")}>
          Cancel Order
        </Button>
      </div>
    </div>
  )
}
