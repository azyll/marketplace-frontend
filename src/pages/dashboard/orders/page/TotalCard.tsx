import { ActionIcon, Card, CopyButton, Skeleton, Tooltip } from "@mantine/core"
import { IconCheck, IconCopy, IconCurrencyPeso, IconUser } from "@tabler/icons-react"
import { IOrder } from "@/types/order.type"
import pluralize from "pluralize"
import { useMemo } from "react"

interface Props {
  order?: IOrder
  isLoading?: boolean
}

const TotalDetailsSkeleton = () => {
  return (
    <div>
      <Skeleton height={20} radius="sm" w={120} />
      <Skeleton height={16} mt={8} w={100} radius="sm" />
    </div>
  )
}

export const TotalCard = ({ order, isLoading }: Props) => {
  const totalQuantity = useMemo(
    () => order?.orderItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order?.orderItems],
  )

  return (
    <Card radius="md" className="!bg-[#f2f5f9]/75" p={18}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between">
          <div className="aspect-square rounded-full bg-white p-2">
            <IconCurrencyPeso />
          </div>

          {order && (
            <CopyButton value={order.total.toString()} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Order Total"} withArrow position="right">
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    size="lg"
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          )}
        </div>

        {isLoading ? (
          <TotalDetailsSkeleton />
        ) : (
          <div>
            <p className="text-lg font-semibold">₱ {order?.total.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">
              Total {pluralize("Item", totalQuantity)}: {totalQuantity}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
