import { useState, useEffect } from "react"
import { Modal, NumberInput, Button, Group, Space, Textarea } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { updateProductStock } from "@/services/products.service"
import { KEY } from "@/constants/key"
import { IconMinus, IconNumber, IconPlus } from "@tabler/icons-react"
import { createReturnItem } from "@/services/return-item.service"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

interface EditStockModalProps {
  opened: boolean
  onClose: () => void
  variantId: string | undefined

  initialQuantity?: number
}

export const MarkAsReturnItemModal = ({
  opened,
  onClose,
  variantId,
  initialQuantity = 0,
}: EditStockModalProps) => {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState<number>(initialQuantity)
  const [reason, setReason] = useState<string>("")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setQuantity(initialQuantity)
    }
  }, [opened, initialQuantity])
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: () => {
      if (!variantId) {
        throw new Error("Product variant ID is required")
      }
      if (quantity <= 0) {
        throw new Error("A minimum of 1 for quantity ")
      }

      return createReturnItem({
        productVariant: variantId,
        quantity,
        reason: reason.trim(),
      })
    },
    onSuccess: () => {
      navigate(ROUTES.DASHBOARD.RETURN_ITEMS.BASE)
      notifications.show({
        title: "Success",
        message: `Mark item as return with a quantity of ${quantity}`,
        color: "green",
      })

      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })
      queryClient.invalidateQueries({ queryKey: [KEY.RETURN_ITEMS] })

      // Close modal and reset form
      handleClose()
    },
    onError: (error: any) => {
      console.log(error)

      notifications.show({
        title: "Error",
        message: error?.response?.data?.error || "Failed to crate return item",
        color: "red",
      })
      if (error?.response?.data?.error === "You have a return item with the item and same reason") {
        navigate(ROUTES.DASHBOARD.RETURN_ITEMS.BASE)
      }
    },
  })

  const handleClose = () => {
    setQuantity(0)
    setReason("")
    onClose()
  }

  const handleSubmit = () => {
    if (!variantId) {
      notifications.show({
        title: "Error",
        message: "No product variant selected",
        color: "red",
      })
      return
    }

    if (quantity <= 0) {
      notifications.show({
        title: "Error",
        message: "Quantity must be greater than 0",
        color: "red",
      })
      return
    }

    mutation.mutate()
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Mark Item as Return Item" centered>
      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 0)}
        min={1}
        description={"Quantity of return item"}
      />
      <Textarea
        label="Reason"
        placeholder="Reason for returning item"
        description={"Reason for return"}
        value={reason}
        onChange={(val) => setReason(val.target.value)}
        resize="vertical"
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!variantId || quantity <= 0 || reason.trim() == ""}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  )
}
