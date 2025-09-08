import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { RouterProvider } from "react-router"
import { router } from "./router/router"
import "@mantine/core/styles.css"
import "@mantine/carousel/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
