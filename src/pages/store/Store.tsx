import { AppShell } from "@mantine/core";
import Header from "../../components/Header";

export default function Store() {
  return (
    <div>
      <AppShell
        padding="md"
        header={{ height: 60 }}
      >
        <AppShell.Header>
          <Header></Header>
        </AppShell.Header>
      </AppShell>
      ;
    </div>
  );
}
