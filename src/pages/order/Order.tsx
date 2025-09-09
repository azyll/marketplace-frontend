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
  Loader,
  Card,
  Group,
  Badge,
  Container,
} from "@mantine/core"
import { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { getOrder } from "@/services/order.service"
import { KEY } from "@/constants/key"
import { useLocation, useParams } from "react-router"
import { getAcronym } from "@/helper/textFormatter"

export default function Order() {
  const user = useContext(AuthContext)
  const location = useLocation()
  const { orderId } = useParams()

  // First try to get orderData from navigation state
  const orderDataFromState = location.state?.orderData

  // If no data from state, fetch it using the orderId from URL params
  const { data: orderDataFromAPI, isLoading } = useQuery({
    queryKey: [KEY.ORDERS, orderId],
    queryFn: () => getOrder(orderId as string),
    enabled: !orderDataFromState && !!orderId,
  })

  // Use data from state if available, otherwise use fetched data
  const orderData = orderDataFromState || orderDataFromAPI

  if (isLoading) {
    return <Loader />
  }

  if (!orderData) {
    return <div>Order not found</div>
  }

  return (
    <Container size="xl" px="md" py="xl">
      {/* Option 1: Full Width with Floating Summary Card */}
      <Stack gap="xl">
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
            <div className="w-full max-w-4xl">
              <Stepper
                active={1}
                allowNextStepsSelect={false}
                size="lg"
                color="blue"
                orientation="horizontal"
              >
                <Stepper.Step
                  label="ORDER PLACED"
                  ta="center"
                  description={
                    <Text size="xs" c="dimmed" ta="center">
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

        {/* ORDER DETAILS - Horizontal Cards Layout */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                  <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                    Order Details
                  </Text>
                  <Badge variant="light" color="blue" size="sm">
                    Pending Payment
                  </Badge>
                </Group>

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Order #
                    </Text>
                    <Text size="sm" fw={500}>
                      {orderData.id}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Total
                    </Text>
                    <Text size="lg" fw={700} c="blue">
                      ₱{orderData.total}
                    </Text>
                  </Group>
                </Stack>

                <Button variant="light" color="blue" size="sm" fullWidth mt="xs">
                  Download Order Slip
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                  Student Information
                </Text>

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      ID
                    </Text>
                    <Text size="sm" fw={500}>
                      {user.user?.student.id}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Name
                    </Text>
                    <Text size="sm" fw={500} style={{ maxWidth: "150px", textAlign: "right" }}>
                      {user.user?.fullName}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Program
                    </Text>
                    <Text size="sm" fw={500}>
                      {getAcronym(user.user?.student.program.name)}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                  Order Summary
                </Text>

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Items
                    </Text>
                    <Text size="sm" fw={500}>
                      -
                    </Text>
                  </Group>

                  <Divider my="xs" />

                  <Group justify="space-between">
                    <Text size="md" fw={600}>
                      Total
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      ₱{orderData.total}
                    </Text>
                  </Group>
                </Stack>

                <Text size="xs" c="red" ta="center" mt="sm">
                  Pay within 24 hours to avoid cancellation
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Alternative: Compact Summary Bar */}
        <Paper shadow="xs" radius="md" p="md" withBorder bg="gray.0">
          <Group justify="space-between" align="center">
            <Group gap="xl">
              <div>
                <Text size="xs" c="dimmed">
                  Order Number
                </Text>
                <Text size="sm" fw={600}>
                  {orderData.id}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Student
                </Text>
                <Text size="sm" fw={600}>
                  {user.user?.fullName}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">
                  Program
                </Text>
                <Text size="sm" fw={600}>
                  {user.user?.student.program.name}
                </Text>
              </div>
            </Group>

            <Group gap="md">
              <div className="text-right">
                <Text size="xs" c="dimmed">
                  Total Amount
                </Text>
                <Text size="xl" fw={700} c="blue">
                  ₱{orderData.total}
                </Text>
              </div>
              <Button variant="filled" color="blue">
                Download Order Slip
              </Button>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}
