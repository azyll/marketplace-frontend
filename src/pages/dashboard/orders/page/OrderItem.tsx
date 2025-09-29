import { IOrderItems } from "@/types/order.type"
import { Card, Image, Skeleton } from "@mantine/core"
import { useMemo } from "react"
import { getImage } from "@/services/media.service"

export const OrderItemSkeleton = () => {
  return (
    <Card withBorder radius="md" className="!border-gray-200">
      <div className="flex gap-4">
        <Skeleton h={120} w={120} radius="md" className="shrink-0" />

        <div className="flex w-full flex-col justify-between gap-2">
          <div>
            <Skeleton w={120} h={20} />
            <Skeleton w={80} h={16} mt={4} />
          </div>

          <div className="flex w-full items-end justify-between gap-2">
            <p className="flex items-center gap-2">
              <Skeleton w={60} h={20} />
            </p>
            <Skeleton w={40} h={18} mt-4 />
          </div>
        </div>
      </div>
    </Card>
  )
}

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
