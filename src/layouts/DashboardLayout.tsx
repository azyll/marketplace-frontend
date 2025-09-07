import { AppShell, Avatar, Badge, Burger, Group, Menu, Stack, Text } from "@mantine/core"
import { Link, Outlet, redirect, useNavigate } from "react-router"
import { useDisclosure } from "@mantine/hooks"
import { useContext } from "react"
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
  // const [opened, { toggle }] = useDisclosure()
  const navigate = useNavigate()

  const { user, logout } = useContext(AuthContext)

  const handleOnLogout = () => {
    logout()
    redirect(ROUTES.AUTH.BASE)
  }

  if (!user) {
    redirect(ROUTES.AUTH.BASE)
    return
  }

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
        <Menu>
          <Menu.Label>Menu</Menu.Label>
          <Menu.Item leftSection={<IconUser size={14} />}>Users</Menu.Item>
          <Menu.Item leftSection={<IconBuildingStore size={14} />}>Products</Menu.Item>
          <Menu.Item leftSection={<IconShoppingBagCheck size={14} />}>Orders</Menu.Item>
        </Menu>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
