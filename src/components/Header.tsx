import { Group, Button, ActionIcon, Input, Title } from "@mantine/core";
import { IconShoppingBag, IconBell, IconUser } from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import Login from "../pages/login/Login";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <nav className="h-14">
      <Group
        className="max-w-[1200px] mx-auto"
        px={{ base: 16, xl: 0 }}
        justify="space-between"
        wrap="nowrap"
      >
        <img
          className="z-0 cursor-pointer"
          src="src\assets\logo.png"
          alt=""
          width={56}
          onClick={() => navigate("/")}
        />

        <Title
          order={4}
          className="z-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          STI Marketplace
        </Title>

        <Group
          className="relative z-10"
          gap="sm"
          wrap="nowrap"
        >
          <HeaderSearchBar />

          <ActionIcon variant="subtle">
            <IconShoppingBag />
          </ActionIcon>

          <ActionIcon variant="subtle">
            <IconBell />
          </ActionIcon>

          {/* visible on pc */}
          <Button
            variant="light"
            visibleFrom="md"
            radius={"xl"}
            onClick={() => navigate("/auth/login")}
          >
            Sign in
          </Button>

          {/* only visible on mobile */}
          <ActionIcon
            variant="subtle"
            hiddenFrom="md"
            onClick={() => navigate("/auth/login")}
          >
            <IconUser />
          </ActionIcon>
        </Group>
      </Group>
    </nav>
  );
}
