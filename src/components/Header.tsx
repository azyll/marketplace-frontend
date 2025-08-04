import {
  Group,
  Button,
  ActionIcon,
  Input,
  Title,
  Avatar,
  Menu,
} from "@mantine/core";
import {
  IconShoppingBag,
  IconBell,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import HeaderSearchBar from "./HeaderSearchBar";
import Login from "../pages/login/Login";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import axios from "../utils/axios";
import { IUser } from "../types/auth.type";

export default function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);

  // const isLoggedIn = useMemo(() => )

  useEffect(() => {
    const ACCESS_TOKEN = localStorage.getItem("accessToken");

    const getUser = async () => {
      try {
        const response = await axios.get<IUser>("/me", {
          headers: {
            Authorization: "Bearer " + ACCESS_TOKEN,
          },
        });
        setUser(response.data);
      } catch (err) {}
    };

    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/", {
      replace: true,
    });
  };

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
