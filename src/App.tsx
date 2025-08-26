import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { Notifications } from "@mantine/notifications";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/index.css";
import { CartProvider } from "./contexts/CartContext";

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
  });

  const location = useLocation();

  const excludedHeaderRoutes = ["/auth/login"];
  const hasHeader = excludedHeaderRoutes.some(
    (route) =>
      location.pathname !== route || location.pathname.startsWith(`${route}/`)
  );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />

        <AuthProvider>
          <CartProvider>
            <AppShell header={{ height: hasHeader ? 56 : 0 }}>
              {hasHeader && (
                <AppShell.Header>
                  <Header />
                </AppShell.Header>
              )}

              <AppShell.Main>
                <div className="font-inter">
                  <Outlet />
                </div>
              </AppShell.Main>
            </AppShell>
          </CartProvider>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
