import { Card, Image, ScrollArea, Text } from "@mantine/core"
import { IconShoppingBag } from "@tabler/icons-react"
import { IProduct, IProductVariant } from "@/types/product.type"
import { getImage } from "@/services/media.service"
import { OrderItemsFormCardItem } from "@/pages/dashboard/orders/form/OrderItemsFormCardItem"
import classnames from "classnames"

export interface OrderCartItem {
  product: IProduct
  variant: IProductVariant
  quantity: number
}

interface Props {
  items?: OrderCartItem[]
  onEdit?: (item: OrderCartItem) => void
  onDelete?: (item: OrderCartItem) => void
  disabled?: boolean
}

export const OrderItemsFormCart = ({ items = [], onDelete, onEdit, disabled }: Props) => {
  return (
    <div className="sticky top-18">
      <Card radius="md" p={0}>
        <div
          className={classnames("px-5 py-5", {
            "border-b border-gray-200": items?.length > 0,
          })}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="aspect-square rounded-full bg-[#f2f5f9]/75 p-2">
              <IconShoppingBag size={20} />
            </div>

            {items?.length > 0 && (
              <Text c={"dimmed"} fz={14} mr={4}>
                {items?.length} Items
              </Text>
            )}
          </div>
        </div>

        {items?.length > 0 ? (
          <ScrollArea h={"70vh"}>
            <div className="flex flex-col divide-y divide-gray-200 border-b border-neutral-200">
              {items?.map((item, index) => (
                <OrderItemsFormCardItem
                  item={item}
                  key={index}
                  onEdit={() => onEdit?.(item)}
                  onDelete={() => onDelete?.(item)}
                  disabled={disabled}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="px-5 pb-5">
            <div className="rounded-md border border-dashed border-gray-200 py-4">
              <p className="text-center text-sm text-neutral-400">No Items in Cart</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
