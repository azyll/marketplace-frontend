import { Group, Button, ActionIcon, Title, Avatar, Menu } from "@mantine/core";
import {
  IconShoppingBag,
  IconBell,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-14">
      <Group
        className="max-w-[1200px] mx-auto"
        px={{ base: 16, xl: 0 }}
        justify="space-between"
        wrap="nowrap"
      >
        <img
          className="z-0 cursor-pointer  grayscale-50"
          src="logo.png"
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

          <ActionIcon
            variant="subtle"
            onClick={() => navigate("/cart")}
          >
            <IconShoppingBag />
          </ActionIcon>

          <ActionIcon variant="subtle">
            <IconBell />
          </ActionIcon>

          {/* visible on pc */}
          {!user ? (
            <Button
              variant="light"
              visibleFrom="md"
              radius={"xl"}
              onClick={() => navigate("/auth/login")}
            >
              Sign in
            </Button>
          ) : (
            <Menu width={200}>
              <Menu.Target>
                <Avatar
                  className="cursor-pointer"
                  key={user.id}
                  name={user.firstName + " " + user.lastName}
                  color="initials"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={() => logout()}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

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
