import { AppShell, Avatar, Badge, Burger, Group, Menu, NavLink, Stack, Text } from "@mantine/core"
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import {
  IconArrowLeft,
  IconBuildingStore,
  IconLogout,
  IconShoppingBagCheck,
  IconUser,
} from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useContext(AuthContext)

  const handleOnLogout = () => {
    logout()
    navigate(ROUTES.AUTH.BASE)
  }

  const items = [
    {
      label: "Users",
      path: ROUTES.DASHBOARD.USER.BASE,
      icon: <IconUser size={14} />,
    },
    {
      label: "Products",
      path: ROUTES.DASHBOARD.PRODUCTS.BASE,
      icon: <IconBuildingStore size={14} />,
    },
    {
      label: "Orders",
      path: ROUTES.DASHBOARD.ORDERS.BASE,
      icon: <IconShoppingBagCheck size={14} />,
    },
  ]

  if (!user) return null

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
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
            leftSection={item.icon}
            label={item.label}
            key={index}
            active={location.pathname === item.path || location.pathname.includes(item.path)}
            // disabled={item.disabled}
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
