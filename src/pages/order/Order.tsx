import { AuthContext } from "@/contexts/AuthContext"
import {
  Stepper,
  Paper,
  Grid,
  Stack,
  Text,
  Title,
  Button,
  Divider,
  Card,
  Group,
  Badge,
} from "@mantine/core"
import { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { getOrder } from "@/services/order.service"
import { KEY } from "@/constants/key"
import { useParams } from "react-router"
import { IOrderItems, IOrderStatusType } from "@/types/order.type"
import SplashScreen from "@/components/SplashScreen"
import { useMediaQuery } from "@mantine/hooks"
import { formatDate } from "@/helper/formatDate"

export default function Order() {
  const user = useContext(AuthContext)
  const { orderId } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: [KEY.ORDERS, orderId],
    queryFn: () => getOrder(orderId as string),
  })

  // Move all hooks before any conditional returns
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Use data from state if available, otherwise use fetched data
  if (isLoading) {
    return <SplashScreen />
  }

  if (!order) {
    return <div>Order not found</div>
  }

  const getStatusColor = (status: IOrderStatusType) => {
    switch (status) {
      case "ongoing":
        return "yellow"
      case "completed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] py-4">
      <Stack gap="md" px={{ base: 16, sm: "xl", xl: 0 }}>
        {/* ORDER STATUS - Full Width */}
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="xl">
            <div className="text-center">
              <Title order={2} c="blue" mb="xs">
                Order Placed Successfully
              </Title>
              <Text c="dimmed" size="sm">
                Make a copy of this receipt for your reference.
              </Text>
              <Text c="red" size="sm" mt="xs">
                Your order will be cancelled if you do not pay it within 24 hours.
              </Text>
            </div>

            {/* ORDER STEPS */}
            <div className="w-full max-w-4xl justify-center">
              <Stepper
                active={-1}
                allowNextStepsSelect={false}
                size="lg"
                orientation={isMobile ? "vertical" : "horizontal"}
                className="!hide-scrollbar flex !flex-nowrap justify-center !overflow-x-auto"
              >
                <Stepper.Step
                  label="ORDER PLACED"
                  ta="center"
                  description={
                    <Text size="xs" c="dimmed" ta="center" style={{ maxWidth: "140px" }}>
                      Successfully placed order
                    </Text>
                  }
                />
                <Stepper.Step
                  label="CONFIRM ORDER"
                  ta="center"
                  description={
                    <Text size="xs" c="dimmed" ta="center" style={{ maxWidth: "140px" }}>
                      Show order number & claim slip at Proware
                    </Text>
                  }
                />
                <Stepper.Step
                  label="PAYMENT"
                  ta="center"
                  description={
                    <Text size="xs" c="dimmed" ta="center" style={{ maxWidth: "140px" }}>
                      Show slip & pay at the Cashier
                    </Text>
                  }
                />
                <Stepper.Step
                  label="CLAIM ORDER"
                  ta="center"
                  description={
                    <Text size="xs" c="dimmed" ta="center" style={{ maxWidth: "120px" }}>
                      Show receipt & claim at Proware
                    </Text>
                  }
                />
              </Stepper>
            </div>
          </Stack>
        </Paper>

        {/* ORDER DETAILS - Responsive Cards Layout */}
        <Grid gutter="md">
          {/* Student Information Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Stack gap="sm">
                <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                  Student Information
                </Text>

                <Stack gap="xs">
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="sm" c="dimmed" style={{ minWidth: "fit-content" }}>
                      ID
                    </Text>
                    <Text size="sm" fw={500} ta="right">
                      0{user.user?.student.id}
                    </Text>
                  </Group>

                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text size="sm" c="dimmed" style={{ minWidth: "fit-content" }}>
                      Name
                    </Text>
                    <Text
                      size="sm"
                      fw={500}
                      ta="right"
                      style={{
                        wordBreak: "break-word",
                        hyphens: "auto",
                        maxWidth: "60%",
                      }}
                    >
                      {user.user?.fullName}
                    </Text>
                  </Group>

                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text size="sm" c="dimmed" style={{ minWidth: "fit-content" }}>
                      Program
                    </Text>
                    <Text
                      size="sm"
                      fw={500}
                      ta="right"
                      style={{
                        wordBreak: "break-word",
                        hyphens: "auto",
                        maxWidth: "60%",
                      }}
                    >
                      {user.user?.student.program.name}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Order Summary Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Stack gap="sm" h="100%" justify="space-between">
                <div>
                  <Group justify="space-between" align="center" mb="sm">
                    <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                      Order Summary
                    </Text>
                    <Badge m={0} color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Order No.
                    </Text>
                    <Text size="sm" fw={500}>
                      {order.id}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Placed on
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(order.createdAt)}
                    </Text>
                  </Group>

                  <Divider my="xs" />

                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Text size="sm" c="dimmed" style={{ minWidth: "fit-content" }}>
                        Items
                      </Text>

                      <Text
                        size="sm"
                        fw={500}
                        ta="right"
                        style={{
                          wordBreak: "break-word",
                          hyphens: "auto",
                          maxWidth: "60%",
                        }}
                      >
                        {order?.orderItems?.map((item: IOrderItems) => (
                          <div key={item.id}>
                            {item.productVariant.product.name} - ${item.productVariant.price}
                          </div>
                        ))}
                      </Text>
                    </Group>

                    <Group justify="space-between" wrap="nowrap">
                      <Text size="md" fw={600}>
                        Total
                      </Text>
                      <Text size="xl" fw={700} c="blue">
                        ₱{order.total}
                      </Text>
                    </Group>
                  </Stack>

                  <Text size="xs" c="red" ta="center" mt="sm">
                    Pay within 24 hours to avoid cancellation
                  </Text>
                </div>

                <Button variant="light" color="blue" size="sm" fullWidth mt="xs">
                  Download Order Slip
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </main>
  )
}
