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
import { useContext, useMemo } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import {
  IconArrowLeft,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconLogout,
  IconReportMoney,
  IconShoppingBagCheck,
  IconUser,
  IconShield,
  IconBook,
  IconLibrary,
  IconTruckReturn,
  IconActivity,
  IconCarouselHorizontal,
} from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getOrders } from "@/services/order.service"
import { getInventoryAlerts } from "@/services/products.service"
import { checkModuleAccess, getModuleFromPathname } from "@/router/components/ProtectedRoute"

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useContext(AuthContext)

  const { data: ongoingOrders } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDERS, "ongoing-count"],
    queryFn: () => getOrders({ status: "ongoing", limit: 1000 }),
  })

  const { data: confirmedOrders } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDERS, "confirmed-count"],
    queryFn: () => getOrders({ status: "confirmed", limit: 1000 }),
  })

  const totalOrdersCount = (ongoingOrders?.data.length || 0) + (confirmedOrders?.data.length || 0)

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

  const inventoryCount = (criticalStock?.noStock || 0) + (criticalStock?.lowStock || 0)

  const items = [
    //Admin Only
    {
      label: "Users",
      path: ROUTES.DASHBOARD.USER.BASE,
      icon: <IconUser size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin", "employee"],
    },
    {
      label: "Roles",
      path: ROUTES.DASHBOARD.ROLES.BASE,
      icon: <IconShield size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin"],
    },
    {
      label: "Department",
      path: ROUTES.DASHBOARD.DEPARTMENTS.BASE,
      icon: <IconLibrary size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin"],
    },
    {
      label: "Program",
      path: ROUTES.DASHBOARD.PROGRAMS.BASE,
      icon: <IconBook size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin"],
    },
    {
      label: "Activity Logs",
      path: ROUTES.DASHBOARD.ACTIVITY_LOG.BASE,
      icon: <IconActivity size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin"],
    },

    //Employee & Admin
    {
      label: "Products",
      path: ROUTES.DASHBOARD.PRODUCTS.BASE,
      icon: <IconBuildingStore size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin", "employee"],
    },
    {
      label: "Orders",
      path: ROUTES.DASHBOARD.ORDERS.BASE,
      icon: <IconShoppingBagCheck size={14} />,
      indicator: totalOrdersCount > 0,
      count: totalOrdersCount,
      roles: ["admin", "employee"],
    },
    {
      label: "Sales",
      path: ROUTES.DASHBOARD.SALES.BASE,
      icon: <IconReportMoney size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin", "employee"],
    },
    {
      label: "Inventory",
      path: ROUTES.DASHBOARD.INVENTORY.BASE,
      icon: <IconBuildingWarehouse size={14} />,
      indicator: criticalStock?.hasAlerts,
      count: inventoryCount,
      roles: ["admin", "employee"],
    },
    {
      label: "Return Items",
      path: ROUTES.DASHBOARD.RETURN_ITEMS.BASE,
      icon: <IconTruckReturn size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin", "employee"],
    },
    {
      label: "Announcement Carousel",
      path: ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.BASE,
      icon: <IconCarouselHorizontal size={14} />,
      indicator: false,
      count: 0,
      roles: ["admin", "employee"],
    },
  ]

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (!item?.roles || !user) return false

        const userRoleTag = user.role.systemTag

        // 1. High-level Role Check: Filter out links not allowed for the user's general role
        if (!item.roles.includes(userRoleTag)) return false

        // 2. Granular Module Check: ONLY apply for the 'employee' systemTag
        if (userRoleTag === "employee") {
          const module = getModuleFromPathname(item.path)

          // If the link does not map to a protected Module (e.g., /dashboard/home), allow it.
          if (!module) return true

          // Check if the employee has VIEW or EDIT permission for this specific module
          return checkModuleAccess(module, user.role.modulePermission)
        }

        // 3. For 'admin' (or any role not explicitly checked),
        // if it passed the high-level role check (step 1), show the link.
        return true
      }),
    [user, items],
  )

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
        {filteredItems.map((item, index) => (
          <NavLink
            leftSection={
              <Indicator
                disabled={!item.indicator}
                label={item.count > 0 ? item.count : undefined}
                size={16}
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
