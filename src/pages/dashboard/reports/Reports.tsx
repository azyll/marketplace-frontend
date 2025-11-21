import { Card, Tabs, Text } from "@mantine/core"
import {
  IconActivity,
  IconBasket,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCar,
  IconMoneybag,
  IconReportMoney,
  IconShield,
  IconShoppingBagCheck,
  IconTruckReturn,
  IconUser,
} from "@tabler/icons-react"
import InventoryTab from "./tabs/InventoryTab"
import SalesTab from "./tabs/SalesTab"
import OrdersTab from "./tabs/OrdersTab"
import ProductsTab from "./tabs/ProductsTab"

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
            <Tabs.Tab value="users" leftSection={<IconUser size={12} />} size={4}>
              User
            </Tabs.Tab>
            <Tabs.Tab value="roles" leftSection={<IconShield size={12} />} size={4}>
              Roles
            </Tabs.Tab>
            <Tabs.Tab value="products" leftSection={<IconBuildingStore size={12} />} size={4}>
              Products
            </Tabs.Tab>
            <Tabs.Tab value="orders" leftSection={<IconShoppingBagCheck size={12} />} size={4}>
              Order
            </Tabs.Tab>
            <Tabs.Tab value="sales" leftSection={<IconReportMoney size={12} />} size={4}>
              Sales
            </Tabs.Tab>
            <Tabs.Tab value="inventory" leftSection={<IconBuildingWarehouse size={12} />} size={4}>
              Inventory
            </Tabs.Tab>
            <Tabs.Tab value="return-items" leftSection={<IconTruckReturn size={12} />} size={4}>
              Return Items
            </Tabs.Tab>
            <Tabs.Tab value="activity-log" leftSection={<IconActivity size={12} />} size={4}>
              Activity Log
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="users">User tab content</Tabs.Panel>
          <Tabs.Panel value="roles">Roles tab content</Tabs.Panel>
          <Tabs.Panel value="products">
            <ProductsTab />
          </Tabs.Panel>
          <Tabs.Panel value="orders">
            <OrdersTab />
          </Tabs.Panel>
          <Tabs.Panel value="sales">
            <SalesTab />
          </Tabs.Panel>

          <Tabs.Panel value="inventory">
            <InventoryTab />
          </Tabs.Panel>
          <Tabs.Panel value="return-items">return items tab content</Tabs.Panel>
          <Tabs.Panel value="activity-log">activity log tab content</Tabs.Panel>
        </Tabs>
      </Card.Section>
    </Card>
  )
}
