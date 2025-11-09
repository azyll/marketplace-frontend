import { Card, Flex, Space, Text } from "@mantine/core"
import React from "react"
import AnnualChart from "../components/AnnualChart"
import { getAnnualOrders } from "@/services/order.service"
import { LogsCard } from "../components/LogsCard"

export default function OrdersDashboard() {
  return (
    <>
      <Text fw={"bold"} my={"sm"}>
        Orders
      </Text>
      <Flex align="flex-start" justify="flex-start" wrap="wrap" gap="lg">
        <Card style={{ flex: "1 1 calc(60% - 0.75rem)" }}>
          <Card.Section px={24} pt={24}>
            <h1 className="text-sm font-semibold">Orders Per Month</h1>
          </Card.Section>

          <Space h={20} />

          <AnnualChart
            queryKey="annual-orders"
            queryFn={getAnnualOrders}
            label="Orders"
            dataKey="orders"
          />
        </Card>

        {/* Activity Logs */}
        <Card style={{ flex: "1 1 calc(40% - 0.75rem)" }}>
          <Card.Section px={24} pt={24} pb={12}>
            <h1 className="text-sm font-semibold">Orders Activity</h1>
          </Card.Section>

          <LogsCard type="order" />
        </Card>
      </Flex>
    </>
  )
}
