import { AppShell, Burger, Group } from "@mantine/core"
import { Outlet } from "react-router"
import { useDisclosure } from "@mantine/hooks"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export const DashboardLayout = () => {
  const [opened, { toggle }] = useDisclosure()

  const { user } = useContext(AuthContext)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened, desktop: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          Header has a burger icon below sm breakpoint
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        Navbar is collapsed on mobile at sm breakpoint. At that point it is no longer offset by
        padding in the main element and it takes the full width of the screen when opened.
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
