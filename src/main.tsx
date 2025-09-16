import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { RouterProvider } from "react-router"
import { router } from "./router/router"
import "@mantine/core/styles.css"
import "@mantine/carousel/styles.css"
import "@mantine/notifications/styles.css"
import "mantine-datatable/styles.css"
import "@mantine/dropzone/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"

const queryClient = new QueryClient()

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
