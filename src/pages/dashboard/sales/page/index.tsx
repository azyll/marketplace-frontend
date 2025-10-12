import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { getSale, getSales } from "@/services/sales.service"
import { Badge, Button, Card, Skeleton, Space, Text, Title } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Link, useParams } from "react-router"
import { StudentCard } from "../../components/StudentCard"
import { TotalCard } from "../../components/TotalCard"
import pluralize from "pluralize"
import { OrderItem, OrderItemSkeleton } from "../../orders/page/OrderItem"
import { useMemo } from "react"
import { orderStatusColor, orderStatusLabel } from "@/constants/order"

export const SalesPage = () => {
  const { salesId } = useParams<{ salesId: string }>()

  const { data: sales, isLoading } = useQuery({
    queryKey: [KEY.DASHBOARD.SALES, salesId],
    queryFn: () => getSale(salesId),
    select: (response) => response.data,
  })

  const student = useMemo(() => sales?.order?.student, [sales?.order?.student])

  return (
    <Card pos="relative" mih={400}>
      <Card.Section px={24} py={12} pos="relative">
        <Button
          component={Link}
          variant="transparent"
          size="compact-sm"
          ml={-10}
          to={ROUTES.DASHBOARD.SALES.BASE}
        >
          <IconArrowLeft size={16} stroke={2} className="mr-1" /> Go Back
        </Button>

        <div className="mt-4 flex w-full items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Title order={3}># {salesId}</Title>

              {sales?.order?.status && (
                <Badge color={orderStatusColor[sales?.order?.status]}>
                  {orderStatusLabel[sales?.order?.status]}
                </Badge>
              )}
            </div>

            {isLoading ? (
              <Skeleton w={200} h={22} mt={4} />
            ) : (
              <Text c="dimmed">{dayjs(sales?.createdAt).format("MMMM DD YYYY • hh:mm A")}</Text>
            )}
          </div>
        </div>
      </Card.Section>

      <Card.Section px={24} py={12}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StudentCard student={student} isLoading={isLoading} />
          <TotalCard order={sales?.order} isLoading={isLoading} />
        </div>
      </Card.Section>

      <Card.Section px={24} py={12}>
        <div className="flex items-center gap-2">
          <Title order={4}>{pluralize("Item", sales?.order?.orderItems?.length)}</Title>

          {sales?.order?.orderItems?.length && (
            <div className="relative h-[22px] w-[22px] rounded-full bg-[var(--mantine-color-blue-filled)] p-1 text-xs font-bold text-white">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {sales?.order?.orderItems?.length}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {isLoading ? (
            <>
              <OrderItemSkeleton />
              <OrderItemSkeleton />
            </>
          ) : (
            sales?.order?.orderItems?.map((item, index) => <OrderItem item={item} key={index} />)
          )}
        </div>
      </Card.Section>

      <Space h={0} />
    </Card>
  )
}
