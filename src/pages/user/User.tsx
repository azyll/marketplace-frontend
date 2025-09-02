import { AuthContext } from "@/contexts/AuthContext";
import { getImage } from "@/services/media.service";
import { Avatar, Button, Group, Stack, Tabs, Text, Title } from "@mantine/core";
import { IconMail, IconShoppingBag, IconUser } from "@tabler/icons-react";
import { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import "./User.css";
import { ENDPOINT } from "@/constants/endpoints";

export default function User() {
  const navigate = useNavigate();

  const location = useLocation();

  const user = useContext(AuthContext);

  return (
    <main className="user">
      <div className="bg-[#015582]">
        <Group
          py={36}
          justify="space-between"
          align="center"
          className="max-w-page-width mx-auto relative page-x-padding"
        >
          <Group gap="md">
            <Avatar
              src={getImage("bm.jpg")}
              size="95"
              radius="md"
            />
            <Stack gap={2}>
              <Title
                c="white"
                order={3}
              >
                {user.user?.fullName}
              </Title>

              <Group gap={6}>
                <IconMail
                  size={14}
                  color="white"
                  className="-mb-1"
                />
                <Text
                  c="white"
                  size="sm"
                >
                  {user.user?.email}
                </Text>
              </Group>

              <Tabs
                className="absolute bottom-0"
                mt="lg"
                defaultValue={
                  location.pathname.includes("/orders") ? "orders" : "details"
                }
                c="white"
                color="white"
                styles={(theme) => ({
                  list: {
                    borderBottom: "none",
                  },
                })}
              >
                <Tabs.List>
                  <Tabs.Tab
                    value="details"
                    leftSection={<IconUser size={12} />}
                    onClick={() => navigate(ENDPOINT.USER.BASE)}
                    size={4}
                  >
                    Details
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="orders"
                    leftSection={<IconShoppingBag size={12} />}
                    onClick={() => navigate(ENDPOINT.USER.ORDER)}
                    size={4}
                  >
                    Orders
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </Stack>
          </Group>

          {/* Right side: Button */}
          <Button
            variant="white"
            onClick={() => navigate("/")}
          >
            To store
          </Button>
        </Group>
      </div>

      <Outlet />
    </main>
  );
}
