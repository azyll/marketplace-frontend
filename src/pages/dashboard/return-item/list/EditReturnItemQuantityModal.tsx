import { useState, useEffect } from "react"
import { Modal, NumberInput, Button, Group, Space } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { KEY } from "@/constants/key"
import { updateReturnItemQuantity } from "@/services/return-item.service"

interface EditReturnItemQuantityProps {
  opened: boolean
  onClose: () => void
  returnItemId: string | undefined
  initialQuantity?: number
}

export const EditReturnItemQuantity = ({
  opened,
  onClose,
  returnItemId,

  initialQuantity = 0,
}: EditReturnItemQuantityProps) => {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState<number>(initialQuantity)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setQuantity(initialQuantity)
    }
  }, [opened, initialQuantity])

  const mutation = useMutation({
    mutationFn: () => {
      if (!returnItemId) {
        throw new Error("Product variant ID is required")
      }
      return updateReturnItemQuantity(returnItemId, quantity)
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Quantity update successfully",
        color: "green",
      })

      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: [KEY.RETURN_ITEMS] })
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })

      // Close modal and reset form
      handleClose()
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.error || "Failed to update quantity",
        color: "red",
      })
    },
  })

  const handleClose = () => {
    setQuantity(0)
    onClose()
  }

  const handleSubmit = () => {
    if (!returnItemId) {
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
    <Modal opened={opened} onClose={handleClose} title="Update Return Item Quantity" centered>
      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 0)}
        min={1}
        description={"Update return item quantity"}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!returnItemId || quantity <= 0}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  )
}
