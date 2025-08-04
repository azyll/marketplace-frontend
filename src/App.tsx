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

const App: React.FC = () => {
  const theme = createTheme({
    breakpoints: {
      xs: "36rem",
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
    },
  });

  const location = useLocation();

  const showHeader = ["/", "/products"];

  const queryClient = new QueryClient();
  console.log(import.meta.env);
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <AuthProvider>
          <AppShell>
            {showHeader.includes(location.pathname) && (
              <AppShell.Header>
                <Header />
              </AppShell.Header>
            )}

            <AppShell.Main>
              <Outlet />
            </AppShell.Main>
          </AppShell>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
