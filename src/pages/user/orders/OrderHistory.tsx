import { useState, useEffect, useContext } from "react"
import {
  Title,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Alert,
  Divider,
  Flex,
  Center,
  Skeleton,
  Grid,
} from "@mantine/core"
import { IconAlertCircle, IconMoodSad, IconRefresh } from "@tabler/icons-react"
import { IOrder, IOrderItems, IOrderStatusType } from "@/types/order.type"
import { AuthContext } from "@/contexts/AuthContext"
import { getStudentOrders } from "@/services/order.service"
import { useFilters } from "@/hooks/useFilters"
import { OrderHistorySkeleton } from "./components/OrderHistorySkeleton"
import { useNavigate } from "react-router"
import { formatDate } from "@/helper/formatDate"
import { ICart } from "@/types/cart.type"
import { IProduct, IProductVariant } from "@/types/product.type"

// Define the filter state type
interface FilterState {
  page: number
  status: IOrderStatusType | "all"
}

// Custom hook for managing orders data
function useOrdersData(userId: string | undefined, filters: FilterState) {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!userId) {
      setError("Student ID not found")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = {
        page: filters.page,
        limit: 10,
        ...(filters.status !== "all" && { status: filters.status }),
      }

      const response = await getStudentOrders(userId, params)

      // Handle different response structures
      if (response?.data) {
        setOrders(response.data)
      } else if (Array.isArray(response)) {
        setOrders(response)
      } else {
        setOrders([])
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err)
      setError(`Failed to fetch orders: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchOrders()
    }
  }, [filters.page, filters.status, userId])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  }
}

export default function OrderHistory() {
  const user = useContext(AuthContext)
  const userId = user.user?.id

  const navigate = useNavigate()

  // Use the useFilters hook for filter state
  const [filters, setFilter] = useFilters<FilterState>({
    page: 1,
    status: "all",
  })

  // Use the custom hook for orders data
  const { orders, loading, error, refetch } = useOrdersData(userId, filters)

  const handleFilterChange = (newStatus: IOrderStatusType | "all") => {
    setFilter("status", newStatus)
    setFilter("page", 1)
  }

  const getStatusColor = (status: IOrderStatusType) => {
    switch (status) {
      case "ongoing":
        return "yellow"
      case "confirmed":
        return "blue"
      case "completed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  // Show skeleton loading when loading and no orders yet
  if (loading && orders.length === 0) {
    return (
      <div className="max-w-page-width page-x-padding mx-auto mt-4">
        <Stack gap={"lg"}>
          <div>
            <Skeleton height={28} width={150} className="mb-4" />

            {/* Filter Buttons Skeleton */}
            <Group gap="xs" className="mb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={32} width={80} radius="xl" />
              ))}
            </Group>
          </div>

          <Stack gap="md">
            {/* Render 3 skeleton cards */}
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
                onClick={() => handleFilterChange(status)}
                variant={filters.status === status ? "filled" : "white"}
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
            {orders.map((order) => (
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

                    <Badge color={getStatusColor(order.status)} variant="light" tt="capitalize">
                      {order.status}
                    </Badge>
                  </Flex>

                  {/* Order Details */}
                  <div>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Item(s)
                        </Text>

                        <Text size="sm" fw={500} style={{ whiteSpace: "pre-line" }}>
                          {order.orderItems
                            ?.map(
                              (item) =>
                                `${item.productVariant.product.name} (${item.productVariant.size}) × ${item.quantity}`,
                            )
                            .join("\n")}
                        </Text>
                      </div>
                    </Group>

                    {order.updatedAt && (
                      <Group justify="space-between" className="mt-2">
                        <div>
                          {/* <Text size="sm" c="dimmed">
                            Last Updated:
                          </Text>

                          <Text size="xs">{formatDate(order.updatedAt)}</Text> */}
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">
                            Student ID:
                          </Text>

                          <Text size="sm" fw={500}>
                            0{order.studentId}
                          </Text>
                        </div>
                      </Group>
                    )}
                  </div>

                  <Divider />

                  {/* Order Footer */}
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        Total:
                      </Text>
                      <Text size="lg" fw={700}>
                        ₱{order.total.toFixed(2)}
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
