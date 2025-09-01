import { Group, Button, ActionIcon, Title, Avatar, Menu } from "@mantine/core";
import {
  IconShoppingBag,
  IconBell,
  IconUser,
  IconLogout,
  IconLock,
  IconFileTime,
} from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-14">
      <Group
        className="max-w-[1200px] mx-auto h-full"
        px={{ base: 16, xl: 0 }}
        justify="space-between"
        wrap="nowrap"
        align="center"
      >
        <img
          className="z-0 cursor-pointer invert"
          src="/logo.png"
          alt=""
          width={50}
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

          {/* Cart Button */}
          <ActionIcon
            variant="subtle"
            radius="xl"
            onClick={() => {
              if (!user) {
                notifications.show({
                  title: "Login required",
                  message: "Please log in to view your cart",
                  icon: <IconLock size={18} />,
                });

                navigate("/auth/login");
              } else {
                navigate("/cart");
              }
            }}
          >
            <IconShoppingBag />
          </ActionIcon>

          {/* Notifications Button */}
          <ActionIcon
            variant="subtle"
            radius="xl"
          >
            <IconBell />
          </ActionIcon>

          {/* Login Button */}
          {!user ? (
            <>
              {/* Desktop login button */}
              <Button
                variant="light"
                radius="xl"
                visibleFrom="md"
                onClick={() => navigate("/auth/login")}
              >
                Sign in
              </Button>

              {/* Mobile login icon */}
              <ActionIcon
                variant="subtle"
                hiddenFrom="md"
                onClick={() => navigate("/auth/login")}
              >
                <IconUser />
              </ActionIcon>
            </>
          ) : (
            <Menu width={200}>
              <Menu.Target>
                {!user ? (
                  <Avatar
                    src={null}
                    alt="no image here"
                  />
                ) : (
                  <Avatar
                    className="cursor-pointer"
                    key={user.id}
                    name={`${user.firstName} ${user.lastName}`}
                    color="initials"
                  />
                )}
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate("/user")}
                >
                  Profile
                </Menu.Item>

                <Menu.Item
                  leftSection={<IconFileTime size={14} />}
                  onClick={() => navigate("/user/orders")}
                >
                  Order History
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </nav>
  );
}
