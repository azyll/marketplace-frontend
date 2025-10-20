import { ActionIcon, Card, Image } from "@mantine/core"
import { getImage } from "@/services/media.service"
import { OrderCartItem } from "@/pages/dashboard/orders/form/OrderItemsFormCart"
import { useMemo } from "react"
import { IconEdit, IconTrashX } from "@tabler/icons-react"

interface Props {
  item: OrderCartItem
  onEdit?: () => void
  onDelete?: () => void
}

export const OrderItemsFormCardItem = ({ item, onDelete, onEdit }: Props) => {
  const attrs = useMemo(() => {
    const variantName = item.variant.name
    const size = item.variant.size

    return [variantName, size].filter((i) => i && i !== "N/A")
  }, [item])

  return (
    <Card withBorder={false} p={0} radius={0} className="group">
      <div className="flex" style={{ gap: 10 }}>
        <div className="flex items-center bg-gray-50 p-2">
          <div>
            <Image
              w={100}
              h="auto"
              src={getImage(item.product?.image ?? "")}
              className="!aspect-square !shadow-md"
              radius="sm"
            />
          </div>
        </div>

        <div className="flex w-full flex-col justify-between gap-2 py-4 pr-5">
          <div>
            <p className="text-base text-neutral-800">{item.product?.name}</p>
            <p className="text-sm text-neutral-500">{attrs.join(", ")}</p>
          </div>

          <div className="flex w-full flex-row-reverse items-end justify-between gap-2">
            <p className="text-base font-semibold text-neutral-700">
              ₱ {item.variant?.price.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-500">x{item.quantity}</p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 bottom-0 flex h-full translate-x-[45px] transform flex-col items-center justify-center gap-6 border-l border-gray-200 bg-white p-2 transition-all group-hover:translate-x-0">
        <ActionIcon variant="transparent" onClick={() => onEdit?.()}>
          <IconEdit size={16} />
        </ActionIcon>
        <ActionIcon variant="transparent" color="red" onClick={() => onDelete?.()}>
          <IconTrashX size={16} />
        </ActionIcon>
      </div>
    </Card>
  )
}
