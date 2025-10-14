import {
  AppShell,
  Avatar,
  Badge,
  Burger,
  Group,
  Indicator,
  Menu,
  NavLink,
  Stack,
  Text,
} from "@mantine/core"
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import {
  IconArrowLeft,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconLogout,
  IconReportMoney,
  IconShoppingBagCheck,
  IconUser,
} from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getInventoryAlerts } from "@/services/products.service"
import { getOrders } from "@/services/order.service"

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useContext(AuthContext)

  const { data: inventoryAlertData } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-alerts"],
    queryFn: () => getInventoryAlerts(),
  })

  const { data: ordersData } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDERS, "ongoing-count"],
    queryFn: () => getOrders({ status: "ongoing", limit: 1000 }),
  })

  const handleOnLogout = () => {
    logout()
    navigate(ROUTES.AUTH.BASE)
  }

  // Extract counts from inventory alerts
  // Index 0 = No Stock, Index 1 = Low Stock, Index 2 = In Stock
  const outOfStockCount = inventoryAlertData?.data?.[0]?.value || 0
  const lowStockCount = inventoryAlertData?.data?.[1]?.value || 0

  // Extract ongoing orders count
  const ongoingOrdersCount = ordersData?.meta?.totalItems || 0

  const items = [
    {
      label: "Users",
      path: ROUTES.DASHBOARD.USER.BASE,
      icon: <IconUser size={14} />,
      alertCount: 0,
      badges: [],
    },
    {
      label: "Products",
      path: ROUTES.DASHBOARD.PRODUCTS.BASE,
      icon: <IconBuildingStore size={14} />,
      alertCount: 0,
      badges: [],
    },
    {
      label: "Orders",
      path: ROUTES.DASHBOARD.ORDERS.BASE,
      icon: <IconShoppingBagCheck size={14} />,
      badges: [...(ongoingOrdersCount > 0 ? [{ count: ongoingOrdersCount, color: "yellow" }] : [])],
    },
    {
      label: "Inventory",
      path: ROUTES.DASHBOARD.INVENTORY.BASE,
      icon: <IconBuildingWarehouse size={14} />,
      badges: [
        ...(outOfStockCount > 0 ? [{ count: outOfStockCount, color: "red" }] : []),
        ...(lowStockCount > 0 ? [{ count: lowStockCount, color: "yellow" }] : []),
      ],
    },
    {
      label: "Sales",
      path: ROUTES.DASHBOARD.SALES.BASE,
      icon: <IconReportMoney size={14} />,
      alertCount: 0,
      badges: [],
    },
  ]

  if (!user) return null

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 210,
        breakpoint: "xs",
        // collapsed: { mobile: !opened, desktop: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" display="flex" justify="space-between">
          {/*<Burger opened={opened} onClick={toggle} size="sm" />*/}
          <h1 className="text-sm font-bold">DASHBOARD</h1>

          <Menu width={200}>
            <Menu.Target>
              <Group gap="sm" className="cursor-pointer transition-colors hover:text-blue-600">
                <Avatar key={user.id} name={user.fullName} color="initials" radius="xl" />

                <Stack gap={0} className="leading-tight">
                  <Text fw={600} size="sm">
                    {user.fullName}
                  </Text>
                  <Badge variant="light" size="xs" radius="sm" color="blue">
                    {user.role.name}
                  </Badge>
                </Stack>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconArrowLeft size={14} />} component={Link} to={"/"}>
                Go to Marketplace
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={() => handleOnLogout()}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {items.map((item, index) => (
          <NavLink
            leftSection={
              <Indicator
                disabled={item.alertCount === 0}
                size={7}
                color="red"
                styles={{
                  indicator: {
                    fontSize: "10px",
                  },
                }}
              >
                {item.icon}
              </Indicator>
            }
            label={item.label}
            key={index}
            active={location.pathname === item.path || location.pathname.includes(item.path)}
            component={Link}
            to={item.path}
            rightSection={
              item.badges && item.badges.length > 0 ? (
                <Group gap={4}>
                  {item.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} color={badge.color} variant="light" size="xs" circle>
                      {badge.count}
                    </Badge>
                  ))}
                </Group>
              ) : undefined
            }
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="mx-auto max-w-[1200px]">
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
