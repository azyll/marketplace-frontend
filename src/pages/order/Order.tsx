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
  NumberFormatter,
  Space,
} from "@mantine/core"
import { useContext, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getOrder } from "@/services/order.service"
import { KEY } from "@/constants/key"
import { useParams } from "react-router"
import { IOrderItems } from "@/types/order.type"
import SplashScreen from "@/components/SplashScreen"
import { useMediaQuery } from "@mantine/hooks"
import { formatDate } from "@/helper/formatDate"
import { downloadOrderSlip } from "./pdf/OrderSlipPDF"
import { IconCheck, IconX } from "@tabler/icons-react"
import "./Orders.css"
import { orderStatusColor, orderStatusLabel } from "@/constants/order"
import { getSaleByOrder } from "@/services/sales.service"

export default function Order() {
  const user = useContext(AuthContext)
  const { orderId } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: [KEY.ORDERS, orderId],
    queryFn: () => getOrder(orderId as string),
    select: (response) => response.data,
  })

  const { data: sale, isLoading: isSalesLoading } = useQuery({
    queryKey: [KEY.SALES, orderId],
    queryFn: () => getSaleByOrder(orderId as string),
    select: (response) => response.data,
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleDownloadOrder = async () => {
    if (order) {
      try {
        await downloadOrderSlip({
          studentName: user.user?.fullName || "",
          studentId: user.user?.student.id,
          sex: user.user?.student.sex,
          program: user.user?.student.program.name || "",
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

  const handleDownloadIssuance = () => {}

  const isCancelled = useMemo(() => order?.status === "cancelled", [order?.status])

  const completedIcon = useMemo(
    () => (isCancelled ? <IconX stroke={4} /> : <IconCheck stroke={4} />),
    [isCancelled],
  )

  if (isLoading) {
    return <SplashScreen />
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <main className="mx-auto max-w-[1200px] py-4">
      <Stack gap="md" px={{ base: 16, sm: "xl", xl: 0 }}>
        {/* ORDER STATUS - Full Width */}
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="xl">
            <div className="text-center">
              <Title order={2} c="blue" mb="xs">
                {isCancelled ? "Order Cancelled" : "Order Placed Successfully"}
              </Title>
              <Text c="dimmed" size="sm">
                Make a copy of this slip for your reference.
              </Text>
              {!isCancelled && order.status === "ongoing" && (
                <Text c="red" size="sm" mt="xs">
                  Your order will be cancelled if you do not confirm it at proware within 24 hours.
                </Text>
              )}
            </div>

            {/* ORDER STEPS */}
            <div className="w-full max-w-4xl justify-center">
              <Stepper
                active={(() => {
                  switch (order.status) {
                    case "cancelled":
                      return 4
                    case "ongoing":
                      return 1
                    case "confirmed":
                      return 2
                    case "completed":
                      return 4
                    default:
                      return 0
                  }
                })()}
                allowNextStepsSelect={false}
                orientation={isMobile ? "vertical" : "horizontal"}
                wrap={false}
                className="!hide-scrollbar flex !flex-nowrap justify-center !overflow-x-auto"
              >
                <Stepper.Step
                  label="PLACED"
                  completedIcon={<IconCheck stroke={4} />}
                  description={
                    <Text size="xs" c="dimmed">
                      Successfully placed order
                    </Text>
                  }
                  className={"!items-start"}
                />
                <Stepper.Step
                  label="CONFIRM"
                  completedIcon={completedIcon}
                  color={order.status === "cancelled" ? "red" : undefined}
                  description={
                    <Text size="xs" c="dimmed">
                      Go to proware to confirm order
                    </Text>
                  }
                  className={"!items-start"}
                />
                <Stepper.Step
                  label="PAYMENT"
                  //
                  completedIcon={completedIcon}
                  color={order.status === "cancelled" ? "red" : undefined}
                  description={
                    <Text size="xs" c="dimmed">
                      Go to cashier & show order slip and pay
                    </Text>
                  }
                  className={"!items-start"}
                />
                <Stepper.Step
                  label="CLAIM"
                  completedIcon={completedIcon}
                  color={order.status === "cancelled" ? "red" : undefined}
                  description={
                    <Text size="xs" c="dimmed">
                      Show sales invoice to claim at proware
                    </Text>
                  }
                  className={"!items-start"}
                />
              </Stepper>
            </div>
          </Stack>
        </Paper>

        <Grid gutter="md">
          {/* Order Summary Card */}
          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Stack gap="sm" h="100%" justify="space-between">
                <div>
                  <Group justify="space-between" align="center" mb="sm">
                    <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                      Order Summary
                    </Text>
                    <Badge m={0} color={orderStatusColor[order.status]} tt="capitalize">
                      {orderStatusLabel[order.status]}
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
                    </Group>

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
                              {item.productVariant.name === "N/A" ? "" : item.productVariant.name} ×{" "}
                              {item.quantity}
                            </span>
                          </Text>
                        ))
                      ) : (
                        <Text size="sm" c="dimmed">
                          —
                        </Text>
                      )}
                    </Stack>

                    {/* {order?.orderItems?.map((item: IOrderItems) => (
                      <div key={item.id}>
                        <Group
                          justify="space-between"
                          align="center"
                          wrap="nowrap"
                          gap="xs"
                          style={{ fontSize: "13px", lineHeight: "1.2" }}
                        >
                          <Text style={{ fontSize: "13px", lineHeight: "1.2" }}>
                            {item.productVariant.product.name} × {item.quantity} pc(s)
                          </Text>
                          <NumberFormatter
                            prefix="₱ "
                            value={item.quantity * item.productVariant.price}
                            thousandSeparator=","
                            decimalSeparator="."
                            decimalScale={2}
                            fixedDecimalScale
                            style={{ fontSize: "13px", lineHeight: "1.2" }}
                          />
                        </Group>
                      </div>
                    ))} */}

                    <Group justify="space-between" wrap="nowrap">
                      <Text size="md" fw={600}>
                        Total
                      </Text>

                      <Text size="xl" fw={700} c="blue">
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
                  </Stack>
                </div>

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
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 6 }}>
            {/* Sales Card */}
            {sale && (
              <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
                <Stack gap="sm" justify="space-between">
                  <div>
                    <Group justify="space-between" align="center" mb="sm">
                      <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                        Sales Issuance
                      </Text>
                      <Badge color="green" variant="light">
                        ISSUED
                      </Badge>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Issuance Code
                      </Text>
                      <Text size="sm" fw={500}>
                        {sale?.id}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Sales Invoice No.
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
                        {sale?.oracleInvoice}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Issuance Date
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {formatDate(sale?.createdAt)}
                      </Text>
                    </Group>
                  </div>

                  {/* <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    fullWidth
                    mt="xs"
                    onClick={handleDownloadIssuance}
                  >
                    Download Issuance Slip
                  </Button> */}
                </Stack>
              </Card>
            )}

            {/* Student Details */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={600} c="dimmed" tt="uppercase">
                  Student Details
                </Text>

                <Text fw={600}>
                  {user.user?.fullName}
                  <Text component="span" size="md" c="dimmed" fw={400}>
                    {" "}
                    (0{user.user?.student.id})
                  </Text>
                </Text>

                <Text size="sm" c="dimmed">
                  {user.user?.student.program.name} •{" "}
                  <Text component="span" tt="capitalize">
                    {user.user?.student.level}
                  </Text>
                </Text>
              </Stack>
            </Card>

            <Space h="md" />
          </Grid.Col>
        </Grid>
      </Stack>
    </main>
  )
}
