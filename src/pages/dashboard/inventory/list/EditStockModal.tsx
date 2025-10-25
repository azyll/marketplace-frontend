import { useState, useEffect } from "react"
import { Modal, NumberInput, Button, Group, Space, Text } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { updateProductStock } from "@/services/products.service"
import { KEY } from "@/constants/key"
import { IconMinus, IconPlus } from "@tabler/icons-react"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"

interface EditStockModalProps {
  opened: boolean
  onClose: () => void
  variantId: string | undefined
  currentStock?: number // Add this prop
  variantName?: string // Optional: to show which variant is being edited
  initialAction?: "add" | "minus"
  initialQuantity?: number
}

export const EditStockModal = ({
  opened,
  onClose,
  variantId,
  currentStock = 0, // Default to 0 if not provided
  variantName,
  initialAction = "add",
  initialQuantity = 0,
}: EditStockModalProps) => {
  const queryClient = useQueryClient()
  const [action, setAction] = useState<"add" | "minus">(initialAction)
  const [quantity, setQuantity] = useState<number>(initialQuantity)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setAction(initialAction)
      setQuantity(initialQuantity)
    }
  }, [opened, initialAction, initialQuantity])

  const mutation = useMutation({
    mutationFn: () => {
      if (!variantId) {
        throw new Error("Product variant ID is required")
      }
      return updateProductStock({
        productVariantId: variantId,
        newStockQuantity: quantity,
        action,
      })
    },
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `Stock ${action === "add" ? "added" : "subtracted"} successfully`,
        color: "green",
      })

      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })

      // Close modal and reset form
      handleClose()
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Stock", "update")
    },
  })

  const handleClose = () => {
    setAction("add")
    setQuantity(0)
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

  // Calculate the new stock quantity
  const newStockQuantity =
    action === "add" ? currentStock + quantity : Math.max(0, currentStock - quantity)

  return (
    <Modal opened={opened} onClose={handleClose} title="Update Stock Quantity" centered>
      {variantName && (
        <Text size="sm" c="dimmed" mb="md">
          Editing: <strong>{variantName}</strong>
        </Text>
      )}

      <Text size="sm" mb="md">
        Current Stock: <strong>{currentStock}</strong>
      </Text>

      <Group mb="md" gap="sm">
        <Button
          variant={action === "add" ? "filled" : "subtle"}
          onClick={() => setAction("add")}
          leftSection={<IconPlus size={16} />}
        >
          Add
        </Button>

        <Button
          variant={action === "minus" ? "filled" : "subtle"}
          onClick={() => setAction("minus")}
          leftSection={<IconMinus size={16} />}
        >
          Subtract
        </Button>
      </Group>

      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 0)}
        min={1}
        leftSection={action === "add" ? <IconPlus size={16} /> : <IconMinus size={16} />}
        description={
          action === "add"
            ? "Amount to add to current stock"
            : "Amount to subtract from current stock"
        }
      />

      {quantity > 0 && (
        <Text size="sm" mt="md" c={action === "minus" && newStockQuantity === 0 ? "red" : "blue"}>
          New stock will be: <strong>{newStockQuantity}</strong>
        </Text>
      )}

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={mutation.isPending}
          disabled={!variantId || quantity <= 0}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  )
}
