import { Badge, Button, Card, Skeleton, Space, Text, Title } from "@mantine/core"
import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getOrder } from "@/services/order.service"
import { IconArrowLeft } from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"
import { orderStatusColor, orderStatusLabel } from "@/constants/order"
import { useContext, useMemo } from "react"
import dayjs from "dayjs"
import { StudentCard } from "@/pages/dashboard/components/StudentCard"
import { TotalCard } from "@/pages/dashboard/components/TotalCard"
import pluralize from "pluralize"
import { OrderItem, OrderItemSkeleton } from "@/pages/dashboard/orders/page/OrderItem"
import { OrderActions } from "@/pages/dashboard/orders/components/OrderActions"
import { formatDate } from "@/helper/formatDate"
import { downloadOrderSlip } from "@/pages/order/pdf/OrderSlipPDF"

export const OrdersPage = () => {
  const { orderId } = useParams<{ orderId: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDER, orderId],
    queryFn: () => getOrder(orderId ?? ""),
    select: (response) => response.data,
  })

  const handleDownloadOrder = async () => {
    if (order) {
      try {
        await downloadOrderSlip({
          studentName: order.student.user.fullName || "",
          studentId: order.studentId,
          sex: order.student.sex,
          program: order.student.program.name || "",
          orderItems: order.orderItems ?? [],
          total: order.total,
          orderId: order.id.toString(),
          createdAt: formatDate(order.createdAt),
        })
      } catch (error) {
        console.error("Error generating PDF:", error)
      }
    }
  }

  const student = useMemo(() => order?.student, [order?.student])

  if (!order && !isLoading) return null

  return (
    <Card pos="relative" mih={400}>
      <Card.Section px={24} py={12} pos="relative">
        <Button
          component={Link}
          variant="transparent"
          size="compact-sm"
          ml={-10}
          to={ROUTES.DASHBOARD.ORDERS.BASE}
        >
          <IconArrowLeft size={16} stroke={2} className="mr-1" /> Go Back
        </Button>

        <div className="mt-4 flex w-full items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Title order={3}># {orderId}</Title>

              {order?.status && (
                <Badge color={orderStatusColor[order?.status]}>
                  {orderStatusLabel[order?.status]}
                </Badge>
              )}
            </div>

            {isLoading ? (
              <Skeleton w={200} h={22} mt={4} />
            ) : (
              <Text c="dimmed">{dayjs(order?.createdAt).format("MMMM DD YYYY • hh:mm A")}</Text>
            )}

            <Button
              variant="light"
              color="blue"
              size="sm"
              fullWidth
              mt="xs"
              onClick={handleDownloadOrder}
            >
              Download Order Slip
            </Button>
          </div>
          {order && <OrderActions status={order?.status} selectedOrders={[order]} />}
        </div>
      </Card.Section>

      <Card.Section px={24} py={12}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StudentCard student={student} isLoading={isLoading} />
          <TotalCard order={order} isLoading={isLoading} />
        </div>
      </Card.Section>

      <Card.Section px={24} py={12}>
        <div className="flex items-center gap-2">
          <Title order={4}>{pluralize("Item", order?.orderItems?.length)}</Title>

          {order?.orderItems?.length && (
            <div className="relative h-[22px] w-[22px] rounded-full bg-[var(--mantine-color-blue-filled)] p-1 text-xs font-bold text-white">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {order?.orderItems?.length}
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
            order?.orderItems?.map((item, index) => <OrderItem item={item} key={index} />)
          )}
        </div>
      </Card.Section>

      <Space h={0} />

      {/*<LoadingOverlay visible={isLoading} zIndex={1000} />*/}
    </Card>
  )
}
