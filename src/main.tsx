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
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { AuthProvider } from "./contexts/AuthContext"
import { theme } from "./themes/theme"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
