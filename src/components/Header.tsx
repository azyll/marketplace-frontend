import {
  Group,
  Button,
  ActionIcon,
  Title,
  Avatar,
  Menu,
  Stack,
  Text,
  Badge,
} from "@mantine/core";
import {
  IconShoppingBag,
  IconBell,
  IconUser,
  IconLogout,
  IconLock,
  IconClipboardList,
} from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { ENDPOINT } from "@/constants/endpoints";
import { getAcronym } from "@/helper/textFormatter";

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

                navigate(ENDPOINT.LOGIN);
              } else {
                navigate(ENDPOINT.CART.BASE);
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
                onClick={() => navigate(ENDPOINT.LOGIN)}
              >
                Sign in
              </Button>

              {/* Mobile login icon */}
              <ActionIcon
                variant="subtle"
                hiddenFrom="md"
                onClick={() => navigate(ENDPOINT.LOGIN)}
              >
                <IconUser />
              </ActionIcon>
            </>
          ) : (
            <Menu width={200}>
              <Menu.Target>
                <Group
                  gap="sm"
                  className="cursor-pointer transition-colors hover:text-blue-600"
                >
                  <Stack
                    gap={0}
                    className="leading-tight"
                  >
                    <Text
                      fw={600}
                      size="sm"
                    >
                      {user.fullName}
                    </Text>
                    <Text
                      size="xs"
                      c="dimmed"
                      className="tracking-wide"
                    >
                      <Badge
                        variant="light"
                        size="xs"
                        radius="sm"
                        color="blue"
                      >
                        {getAcronym(user.student?.program?.name)}
                      </Badge>
                    </Text>
                  </Stack>

                  <Avatar
                    key={user.id}
                    name={user.fullName}
                    color="initials"
                    radius="xl"
                  />
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate(ENDPOINT.USER.BASE)}
                >
                  Profile
                </Menu.Item>

                <Menu.Item
                  leftSection={<IconClipboardList size={14} />}
                  onClick={() => navigate(ENDPOINT.USER.ORDER)}
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
