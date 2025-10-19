import { IconMinus, IconPlus } from "@tabler/icons-react"
import { Button, NumberInput, Group, TextInput } from "@mantine/core"

interface QuantityInputProps {
  quantity: number
  setQuantity: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export default function QuantityInput({
  quantity,
  setQuantity,
  min = 1,
  max = 3,
  disabled = false,
}: QuantityInputProps) {
  const increment = () => {
    if (disabled || quantity >= max) return
    setQuantity(quantity + 1)
  }

  const decrement = () => {
    if (disabled || quantity <= min) return
    setQuantity(quantity - 1)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const val = parseInt(event.target.value)
    if (!isNaN(val)) {
      if (val > max) return setQuantity(max)
      if (val < min) return setQuantity(min)
      setQuantity(val)
    }
  }

  return (
    <Group gap="sm">
      <Button.Group>
        <Button
          size="compact-sm"
          variant="default"
          onClick={decrement}
          disabled={disabled || quantity <= min}
        >
          <IconMinus size={15} />
        </Button>

        <TextInput
          value={quantity.toString()}
          onChange={handleInputChange}
          disabled={disabled}
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
          onClick={increment}
          disabled={disabled || quantity >= max}
        >
          <IconPlus size={15} />
        </Button>
      </Button.Group>
    </Group>
  )
}
