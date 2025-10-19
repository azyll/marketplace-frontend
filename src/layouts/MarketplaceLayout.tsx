import { AppShell } from "@mantine/core"
import Header from "@/components/Header"
import { Outlet } from "react-router"

export const MarketplaceLayout = () => {
  return (
    <AppShell header={{ height: 56 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
