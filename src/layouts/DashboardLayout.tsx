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
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { useContext } from "react"
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
import { getOrders } from "@/services/order.service"
import { getInventoryAlerts } from "@/services/products.service"

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useContext(AuthContext)

  const { data: ongoingOrders } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDERS, "ongoing-count"],
    queryFn: () => getOrders({ status: "ongoing", limit: 1000 }),
  })

  const { data: criticalStock } = useQuery({
    queryKey: ["inventory-alert"],
    queryFn: () => getInventoryAlerts(),
    select: (response) => {
      const alerts = response.data
      // Check if "No Stock" or "Low Stock" has items
      const noStock =
        alerts.find((item: { value: number; label: string }) => item.label === "No Stock")?.value ||
        0
      const lowStock =
        alerts.find((item: { value: number; label: string }) => item.label === "Low Stock")
          ?.value || 0
      return {
        hasAlerts: noStock > 0 || lowStock > 0,
        noStock,
        lowStock,
        data: alerts,
      }
    },
  })

  const handleOnLogout = () => {
    logout()
    navigate(ROUTES.AUTH.BASE)
  }

  const items = [
    {
      label: "Users",
      path: ROUTES.DASHBOARD.USER.BASE,
      icon: <IconUser size={14} />,
      indicator: false,
      badges: [],
    },
    {
      label: "Products",
      path: ROUTES.DASHBOARD.PRODUCTS.BASE,
      icon: <IconBuildingStore size={14} />,
      indicator: false,
      badges: [],
    },
    {
      label: "Orders",
      path: ROUTES.DASHBOARD.ORDERS.BASE,
      icon: <IconShoppingBagCheck size={14} />,
      indicator: ongoingOrders?.data.length !== 0,
    },
    {
      label: "Inventory",
      path: ROUTES.DASHBOARD.INVENTORY.BASE,
      icon: <IconBuildingWarehouse size={14} />,
      indicator: criticalStock?.hasAlerts,
    },
    {
      label: "Sales",
      path: ROUTES.DASHBOARD.SALES.BASE,
      icon: <IconReportMoney size={14} />,
      indicator: false,
      badges: [],
    },
  ]

  if (!user) return null

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
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
                disabled={!item.indicator}
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
