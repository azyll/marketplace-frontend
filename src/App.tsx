import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "./styles/index.css";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

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
