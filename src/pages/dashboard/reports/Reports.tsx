import { Card, Tabs, Text } from "@mantine/core"
import { IconBasket, IconBuildingStore, IconCar, IconMoneybag, IconUser } from "@tabler/icons-react"

export default function ReportsPage() {
  return (
    <Card>
      <Text fw={"bold"}>Report Module</Text>
      <Card.Section px={24} py={24}>
        <Tabs
          defaultValue={"users"}
          styles={(theme) => ({
            list: {
              borderBottom: "none",
            },
          })}
        >
          <Tabs.List>
            <Tabs.Tab value="users" leftSection={<IconBuildingStore size={12} />} size={4}>
              User
            </Tabs.Tab>
            <Tabs.Tab value="roles" leftSection={<IconBuildingStore size={12} />} size={4}>
              Roles
            </Tabs.Tab>
            <Tabs.Tab value="products" leftSection={<IconBuildingStore size={12} />} size={4}>
              Products
            </Tabs.Tab>
            <Tabs.Tab value="orders" leftSection={<IconBasket size={12} />} size={4}>
              Order
            </Tabs.Tab>
            <Tabs.Tab value="sales" leftSection={<IconMoneybag size={12} />} size={4}>
              Sales
            </Tabs.Tab>
            <Tabs.Tab value="inventory" leftSection={<IconUser size={12} />} size={4}>
              Inventory
            </Tabs.Tab>
            <Tabs.Tab value="return-items" leftSection={<IconBuildingStore size={12} />} size={4}>
              Return Items
            </Tabs.Tab>
            <Tabs.Tab value="activity-log" leftSection={<IconBuildingStore size={12} />} size={4}>
              Activity Log
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="users">Gallery tab content</Tabs.Panel>

          <Tabs.Panel value="roles">Messages tab content</Tabs.Panel>

          <Tabs.Panel value="products">Settings tab content</Tabs.Panel>
        </Tabs>
      </Card.Section>
    </Card>
  )
}
