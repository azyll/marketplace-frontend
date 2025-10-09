import { useState } from "react"
import { Modal, NumberInput, Button, Group } from "@mantine/core"
import { updateProductStock } from "@/services/products.service"

interface EditStockModalProps {
  opened: boolean
  onClose: () => void
  productVariantId: string
  initialAction?: "add" | "minus"
  initialQuantity?: number
}

export const EditStockModal = ({
  opened,
  onClose,
  productVariantId,
  initialAction = "add",
  initialQuantity = 0,
}: EditStockModalProps) => {
  const [action, setAction] = useState<"add" | "minus">(initialAction)
  const [quantity, setQuantity] = useState<number>(initialQuantity)

  const handleSubmit = () => {
    updateProductStock(action, { productVariantId, newStockQuantity: quantity })
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Stock Quantity" centered>
      <Group mb="md" gap="sm">
        <Button variant={action === "add" ? "filled" : "subtle"} onClick={() => setAction("add")}>
          Add Stock
        </Button>
        <Button
          variant={action === "minus" ? "filled" : "subtle"}
          onClick={() => setAction("minus")}
        >
          Subtract Stock
        </Button>
      </Group>

      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(val) => setQuantity(Number(val) || 0)}
        min={1}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </Group>
    </Modal>
  )
}
