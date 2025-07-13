import { Group, Button, ActionIcon, Input } from "@mantine/core";
import { IconShoppingBag, IconBell, IconUser } from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import Login from "../pages/login/Login";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <nav className="">
      <Group
        px={{ base: 16, md: 24 }}
        justify="space-between"
        wrap="nowrap"
      >
        <img
          className="z-0"
          src="src\assets\logo.png"
          alt=""
          width={56}
        />

        <b className="z-0">STI Marketplace</b>

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
