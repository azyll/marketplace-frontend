import { useState, useEffect } from "react"
import { Modal, NumberInput, Button, Group, Space } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { updateProductStock } from "@/services/products.service"
import { KEY } from "@/constants/key"
import { IconMinus, IconPlus } from "@tabler/icons-react"

interface EditStockModalProps {
  opened: boolean
  onClose: () => void
  variantId: string | undefined
  initialAction?: "add" | "minus"
  initialQuantity?: number
}

export const EditStockModal = ({
  opened,
  onClose,
  variantId,
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
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to update stock",
        color: "red",
      })
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

  return (
    <Modal opened={opened} onClose={handleClose} title="Edit Stock Quantity" centered>
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
