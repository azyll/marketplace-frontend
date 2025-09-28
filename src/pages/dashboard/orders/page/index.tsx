import { Badge, Button, Card, LoadingOverlay, Text, Title } from "@mantine/core"
import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getOrder } from "@/services/order.service"
import { IconArrowLeft } from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"
import { orderStatusColor, orderStatusLabel } from "@/constants/order"
import { useMemo } from "react"
import dayjs from "dayjs"

export const OrdersPage = () => {
  const { orderId } = useParams<{ orderId: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDER, orderId],
    queryFn: () => getOrder(orderId ?? ""),
  })

  const student = useMemo(() => order?.student, [order?.student])

  if (!order && !isLoading) return null

  return (
    <Card pos="relative" mih={400}>
      <Card.Section p={24} pos="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button
              component={Link}
              variant="transparent"
              size="compact-sm"
              ml={-10}
              to={ROUTES.DASHBOARD.ORDERS.BASE}
            >
              <IconArrowLeft size={16} stroke={2} className="mr-1" /> Go Back
            </Button>

            <div>
              <div className="mt-4 flex items-center gap-4">
                <Title order={3}># {orderId}</Title>

                {order?.status && (
                  <Badge color={orderStatusColor[order?.status]}>
                    {orderStatusLabel[order?.status]}
                  </Badge>
                )}
              </div>
              <Text c="dimmed">{dayjs(order?.createdAt).format("MMMM DD YYYY")}</Text>
            </div>
          </div>

          <div className="flex gap-2"></div>
        </div>
      </Card.Section>

      <Card.Section p={24}>
        <div className="flex gap-4">
          <div>
            <p className="text-lg font-semibold">{student?.user.fullName}</p>
            <p className="text-sm text-neutral-500">{student?.user.username}@fairview.sti.edu.ph</p>
            <p className="text-sm text-neutral-500">{student?.id}</p>
          </div>
        </div>
      </Card.Section>

      <LoadingOverlay visible={isLoading} zIndex={1000} />
    </Card>
  )
}
