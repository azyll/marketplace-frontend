import { IOrderItems } from "@/types/order.type"
import { Card, Image } from "@mantine/core"
import { useMemo } from "react"
import { getImage } from "@/services/media.service"

interface Props {
  item: IOrderItems
}
export const OrderItem = ({ item }: Props) => {
  const product = useMemo(() => item?.productVariant.product, [item])
  const variant = useMemo(() => item?.productVariant, [item])
  const attribute = useMemo(() => item?.productVariant.productAttribute, [item])

  return (
    <Card withBorder radius="md" className="!border-gray-200">
      <div className="flex gap-4">
        <Image
          radius="md"
          w={120}
          h={120}
          src={getImage(product?.image)}
          className="!aspect-square"
        />

        <div className="flex w-full flex-col justify-between gap-2">
          <div>
            <p className="font-semibold">{product?.name}</p>
            <p className="text-sm text-neutral-600">
              {attribute?.name && <span>{attribute.name}: </span>} {variant?.name}
            </p>
          </div>

          <div className="flex w-full items-end justify-between gap-2">
            <p className="font-semibold text-neutral-700">₱ {variant?.price.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">x{item.quantity}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
