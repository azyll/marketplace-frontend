import { Card, Grid, Stack, Text } from "@mantine/core"
import React from "react"
import { AlertsCard } from "../inventory/list/AlertsCard"
import { KEY } from "@/constants/key"
import { getInventoryAlerts } from "@/services/products.service"
import { useQuery } from "@tanstack/react-query"
import { LogsCard } from "../components/LogsCard"

export default function InventoryDashboard() {
  const { data: inventoryAlertData, isLoading: isAlertsLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-alerts"],
    queryFn: () => getInventoryAlerts(),
  })
  return (
    <>
      <Text fw={"bold"} my={"sm"}>
        Inventory
      </Text>
      <Grid grow gutter="lg" align="stretch">
        <Grid.Col span={5}>
          {/* Alerts */}
          <Stack gap="lg" style={{ height: "100%" }}>
            <AlertsCard
              title="No Stock"
              data={inventoryAlertData?.data?.[0]}
              isLoading={isAlertsLoading}
              description="Item needs to be restocked"
            />

            <AlertsCard
              title="Low Stock"
              data={inventoryAlertData?.data?.[1]}
              isLoading={isAlertsLoading}
              description="Item has less than 20 stock"
            />

            <AlertsCard
              title="In Stock"
              data={inventoryAlertData?.data?.[2]}
              isLoading={isAlertsLoading}
              description="Items have enough stock"
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={7}>
          {/* Activity Logs */}
          <Card withBorder>
            <Card.Section px={24} pt={24} pb={12}>
              <h1 className="text-xl font-bold">Inventory Activity</h1>
            </Card.Section>

            <LogsCard type="inventory" />
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}
