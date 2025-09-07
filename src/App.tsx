import "@mantine/core/styles.css"
import "@mantine/carousel/styles.css"
import "@mantine/notifications/styles.css"

import "mantine-datatable/styles.css"

import "./styles/index.css"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Outlet, useLocation } from "react-router"
import Header from "./components/Header"
import { AuthProvider } from "./contexts/AuthContext"
import { Notifications } from "@mantine/notifications"
import { AppShell, createTheme, MantineProvider } from "@mantine/core"
import { CartProvider } from "./contexts/CartContext"
import { ROUTES } from "@/constants/routes"

const App: React.FC = () => {
  const theme = createTheme({
    breakpoints: {
      xs: "36rem",
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
    },
    fontFamily: "Inter, sans-serif",
  })

  const location = useLocation()

  const excludedHeaderRoutes = ["/auth/login", ROUTES.DASHBOARD.BASE]

  const hasHeader = excludedHeaderRoutes.every(
    (route) => location.pathname !== route && !location.pathname.startsWith(`${route}/`),
  )

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />

        <AuthProvider>
          <CartProvider>
            <Outlet />
          </CartProvider>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
