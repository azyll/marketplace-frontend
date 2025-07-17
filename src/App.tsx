import "@mantine/core/styles.css";
import "./styles/index.css";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";

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

  const showHeader = ["/", "/store"];

  return (
    <MantineProvider theme={theme}>
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
    </MantineProvider>
  );
};

export default App;
