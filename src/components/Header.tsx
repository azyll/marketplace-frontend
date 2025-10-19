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
  Skeleton,
  Indicator,
} from "@mantine/core"
import {
  IconShoppingBag,
  IconUser,
  IconLogout,
  IconLock,
  IconClipboardList,
  IconLayoutDashboard,
} from "@tabler/icons-react"
import HeaderSearchBar from "./HeaderSearchBar"
import NotificationPopover from "./NotificationPopover"
import { useNavigate } from "react-router"
import { useContext, useMemo } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { notifications } from "@mantine/notifications"
import { ENDPOINT } from "@/constants/endpoints"
import { ROUTES } from "@/constants/routes"
import { useQuery } from "@tanstack/react-query"
import { getItems } from "@/services/cart.service"

export default function Header() {
  const navigate = useNavigate()
  const { user, logout, isLoading } = useContext(AuthContext)

  const { data: cart } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getItems(user!.id),
    enabled: !!user?.id,
  })

  const cartCount = cart?.data.length ?? 0

  const isAdmin = useMemo(
    () => user?.role.systemTag === "admin" || user?.role.systemTag === "employee",
    [user],
  )

  return (
    <nav className="h-14">
      <Group
        className="mx-auto h-full max-w-[1200px]"
        px={{ base: 16, xl: 0 }}
        justify="space-between"
        wrap="nowrap"
        align="center"
      >
        <div className="flex items-center gap-2">
          <img
            className="z-0 cursor-pointer"
            src="/logo.png"
            alt=""
            width={45}
            onClick={() => {
              navigate("/")
              window.location.reload()
            }}
          />
          <Title order={4} className="z-0 cursor-pointer" onClick={() => navigate("/")}>
            STI Marketplace
          </Title>
        </div>

        <Group className="relative z-10 !gap-4 md:!gap-6" wrap="nowrap">
          <HeaderSearchBar />

          {/* Cart Button */}
          {cartCount > 0 ? (
            <Indicator
              inline
              label={cartCount}
              size={18}
              offset={3}
              withBorder
              classNames={{ indicator: "!text-[12px] !p-1" }}
            >
              <ActionIcon
                variant="subtle"
                radius="xl"
                onClick={() => {
                  if (!user) {
                    notifications.show({
                      title: "Login required",
                      message: "Please log in to view your cart",
                      icon: <IconLock size={18} />,
                    })
                    navigate(ENDPOINT.LOGIN)
                  } else {
                    navigate(ENDPOINT.CART.BASE)
                  }
                }}
              >
                <IconShoppingBag />
              </ActionIcon>
            </Indicator>
          ) : (
            <ActionIcon
              variant="subtle"
              radius="xl"
              onClick={() => {
                if (!user) {
                  notifications.show({
                    title: "Login required",
                    message: "Please log in to view your cart",
                    icon: <IconLock size={18} />,
                  })
                  navigate(ENDPOINT.LOGIN)
                } else {
                  navigate(ENDPOINT.CART.BASE)
                }
              }}
            >
              <IconShoppingBag />
            </ActionIcon>
          )}

          {/* Notifications Component */}
          <NotificationPopover />

          {/* Loading State */}
          {isLoading ? (
            <Group gap="sm" wrap="nowrap">
              <Skeleton circle height={34} width={34} />
              <Stack gap={2} visibleFrom="md">
                <Skeleton height={14} width={80} radius="sm" />
                <Skeleton height={12} width={30} radius="sm" />
              </Stack>
            </Group>
          ) : !user ? (
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
              <ActionIcon variant="subtle" hiddenFrom="md" onClick={() => navigate(ENDPOINT.LOGIN)}>
                <IconUser />
              </ActionIcon>
            </>
          ) : (
            <Menu width={200}>
              <Menu.Target>
                <Group gap="sm" className="cursor-pointer transition-colors hover:text-blue-600">
                  <Avatar key={user.id} name={user.fullName} color="initials" radius="xl" />

                  <Stack gap={0} className="leading-tight" visibleFrom="md">
                    <Text fw={600} size="sm">
                      {user.fullName}
                    </Text>

                    <Badge variant="light" size="xs" radius="sm" color="blue">
                      {user.student ? user.student?.program?.acronym : user.role.systemTag}
                    </Badge>
                  </Stack>
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                {/* User info visible on mobile only */}
                <div className="md:hidden">
                  <Menu.Label>
                    <Group justify="space-between" gap={4}>
                      <Text fw={600} size="sm">
                        {user.fullName}
                      </Text>

                      <Badge variant="light" size="xs" radius="sm" color="blue">
                        {user.student ? user.student?.program?.acronym : user.role.systemTag}
                      </Badge>
                    </Group>
                  </Menu.Label>
                  <Menu.Divider />
                </div>

                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate(ENDPOINT.USER.BASE)}
                >
                  Profile
                </Menu.Item>

                {user.student ? (
                  <Menu.Item
                    leftSection={<IconClipboardList size={14} />}
                    onClick={() => navigate(ENDPOINT.USER.ORDER)}
                  >
                    Order History
                  </Menu.Item>
                ) : null}

                <Menu.Divider />

                {isAdmin && (
                  <>
                    <Menu.Item
                      leftSection={<IconLayoutDashboard size={14} />}
                      onClick={() => navigate(ROUTES.DASHBOARD.BASE)}
                    >
                      Dashboard
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                )}

                <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={logout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </nav>
  )
}
