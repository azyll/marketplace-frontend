import { IconMinus, IconPlus } from "@tabler/icons-react"
import { Button, NumberInput, Group, TextInput } from "@mantine/core"

interface QuantityInputProps {
  quantity: number
  setQuantity: (value: number) => void
  min?: number
  max?: number
}

export default function QuantityInput({
  quantity,
  setQuantity,
  min = 1,
  max = 3,
}: QuantityInputProps) {
  const increment = () => {
    if (quantity < max) setQuantity(quantity + 1)
  }

  const decrement = () => {
    if (quantity > min) setQuantity(quantity - 1)
  }

  return (
    <Group gap="sm">
      <Button.Group>
        <Button
          size="compact-sm"
          variant="default"
          // radius="xl"
          onClick={decrement}
          disabled={quantity <= min}
        >
          <IconMinus size={15} />
        </Button>

        <TextInput
          value={quantity}
          onChange={(val) => {
            if (typeof val === "number") {
              if (val > max) return setQuantity(max)
              if (val < min) return setQuantity(min)
              setQuantity(val)
            }
          }}
          min={min}
          max={max}
          styles={{
            input: {
              height: 26,
              minHeight: 26,
              textAlign: "center",
              width: 35,
              borderRadius: 0,
              borderWidth: 0,
              fontSize: 14,
            },
          }}
        />

        <Button
          size="compact-sm"
          variant="default"
          // radius="xl"
          onClick={increment}
          disabled={quantity >= max}
        >
          <IconPlus size={15} />
        </Button>
      </Button.Group>
    </Group>
  )
}
