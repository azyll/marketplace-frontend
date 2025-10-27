import { useState, useContext } from "react"
import {
  Title,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Divider,
  Flex,
  Skeleton,
  NumberFormatter,
} from "@mantine/core"
import { IconMoodSad } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { IOrder, IOrderStatusType } from "@/types/order.type"
import { AuthContext } from "@/contexts/AuthContext"
import { getStudentOrders } from "@/services/order.service"
import { KEY } from "@/constants/key"
import { OrderHistorySkeleton } from "./components/OrderHistorySkeleton"
import { useNavigate } from "react-router"
import { formatDate } from "@/helper/formatDate"
import { orderStatusColor, orderStatusLabel } from "@/constants/order"

export default function OrderHistory() {
  const user = useContext(AuthContext)
  const userId = user.user?.id
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState<IOrderStatusType | "all">("all")

  const { data: orders = [], isLoading } = useQuery({
    queryKey: [KEY.ORDERS, userId, statusFilter],
    queryFn: () =>
      getStudentOrders(userId ?? "", {
        page: 1,
        limit: 100,
        ...(statusFilter !== "all" && { status: statusFilter }),
      }),
    select: (response) => response.data,
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="max-w-page-width page-x-padding mx-auto mt-4">
        <Stack gap="lg">
          <div>
            <Skeleton height={28} width={150} className="mb-4" />
            <Group gap="xs" className="mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={32} width={80} radius="xl" />
              ))}
            </Group>
          </div>
          <Stack gap="md">
            {[1, 2, 3].map((i) => (
              <OrderHistorySkeleton key={i} />
            ))}
          </Stack>
        </Stack>
      </div>
    )
  }

  return (
    <div className="max-w-page-width page-x-padding mx-auto mt-4">
      <Stack gap={0}>
        <div>
          <Title order={3}>Order History</Title>

          {/* Filter Buttons */}
          <Group gap="xs" className="hide-scrollbar mt-2 mb-4 overflow-x-auto" wrap="nowrap">
            {(["all", "ongoing", "confirmed", "completed", "cancelled"] as const).map((status) => (
              <Button
                className="shrink-0"
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "filled" : "white"}
                color="blue"
                size="sm"
                radius="xl"
                tt="capitalize"
              >
                {status}
              </Button>
            ))}
          </Group>
        </div>

        {orders.length === 0 ? (
          <Card h={240} bg="#e9edf3" padding="sm" radius="lg" mx={{ base: 16, xl: 0 }}>
            <div className="flex h-full flex-col items-center justify-center">
              <IconMoodSad color="gray" size={32} stroke={1.5} />
              <Text ta="center" c="dimmed">
                No orders found.
              </Text>
            </div>
          </Card>
        ) : (
          <Stack gap="md">
            {orders.map((order: IOrder) => (
              <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  {/* Order Header */}
                  <Flex justify="space-between" align="flex-start">
                    <div>
                      <Title order={3} size="h4">
                        Order #{order.id.slice(-8)}
                      </Title>
                      <Text size="sm" c="dimmed">
                        Placed on {formatDate(order.createdAt)}
                      </Text>
                    </div>
                    <Badge color={orderStatusColor[order.status]} variant="light" tt="capitalize">
                      {orderStatusLabel[order.status]}
                    </Badge>
                  </Flex>

                  {/* Order Details */}
                  <div>
                    <Group justify="space-between">
                      <div>
                        <span className="flex items-center gap-1">
                          <Text size="sm" c="dimmed">
                            Item(s)
                          </Text>
                          <Badge circle size="sm">
                            {order.orderItems?.length}
                          </Badge>
                        </span>

                        <Stack gap={2}>
                          {order.orderItems?.length ? (
                            order.orderItems.map((item, i) => (
                              <Text key={i} size="sm" fw={500}>
                                {item.productVariant.product.name}
                                <span className="text-gray-500">
                                  {" "}
                                  {item.productVariant.size === "N/A"
                                    ? ""
                                    : item.productVariant.size}{" "}
                                  {item.productVariant.name === "N/A"
                                    ? ""
                                    : item.productVariant.name}{" "}
                                  × {item.quantity}
                                </span>
                              </Text>
                            ))
                          ) : (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          )}
                        </Stack>
                      </div>
                    </Group>
                    <Group justify="space-between" className="mt-2">
                      {order.status === "ongoing" ? (
                        <Text size="sm" c="red">
                          Your order will be cancelled if not confirmed at proware within 24 hours
                          after ordering.
                        </Text>
                      ) : (
                        ""
                      )}
                      <div>
                        <Text size="sm" c="dimmed">
                          Student ID:
                        </Text>
                        <Text size="sm" fw={500}>
                          0{order.studentId}
                        </Text>
                      </div>
                    </Group>
                  </div>

                  <Divider />

                  {/* Order Footer */}
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        Total:
                      </Text>

                      <Text size="lg" fw={700}>
                        <NumberFormatter
                          prefix="₱ "
                          value={order.total}
                          thousandSeparator=","
                          decimalSeparator="."
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </Text>
                    </Group>
                    <Button
                      onClick={() => navigate(`/order/${order.id}`)}
                      variant="light"
                      color="blue"
                      size="sm"
                      radius="xl"
                    >
                      View Details
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  )
}
