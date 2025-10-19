import {
  ActionIcon,
  Stack,
  Text,
  Badge,
  Indicator,
  Popover,
  ScrollArea,
  Divider,
  Group,
  Button,
  Space,
} from "@mantine/core"
import { IconBell, IconCheck, IconPackage, IconSpeakerphone } from "@tabler/icons-react"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { getUserNotifications, updateNotificationStatus } from "@/services/notification.service"
import { supabase } from "@/utils/supabase"
import { formatDistanceToNow } from "date-fns"

export default function NotificationButton() {
  const { user } = useContext(AuthContext)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const { data: userNotifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getUserNotifications(user!.id),
    enabled: !!user?.id,
    refetchInterval: 1000,
  })

  const unreadCount = userNotifications?.meta?.unread ?? 0
  const notificationsList = userNotifications?.data ?? []

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "NotificationReceivers",
          filter: `userId=eq.${user.id}`,
        },
        () => {
          refetchNotifications()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, refetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return

    try {
      await updateNotificationStatus(user.id, notificationId)
      refetchNotifications()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return

    try {
      const unreadNotifications = notificationsList.filter(
        (notification) => !notification.notificationReceiver[0]?.isRead,
      )

      await Promise.all(
        unreadNotifications.map((notification) =>
          updateNotificationStatus(user.id, notification.id),
        ),
      )

      refetchNotifications()
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <IconPackage size={16} />
      case "announcement":
        return <IconSpeakerphone size={16} />
      default:
        return <IconBell size={16} />
    }
  }

  if (!user) return null

  return (
    <Popover
      width={380}
      position="bottom-end"
      shadow="md"
      opened={notificationOpen}
      onChange={setNotificationOpen}
    >
      <Popover.Target>
        <Indicator
          inline
          label={unreadCount}
          size={18}
          offset={3}
          withBorder
          disabled={!unreadCount}
          classNames={{ indicator: "!text-[12px] !p-1" }}
        >
          <ActionIcon
            variant="subtle"
            radius="xl"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <IconBell />
          </ActionIcon>
        </Indicator>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <Stack gap={0}>
          <Group justify="space-between" p="md" pb="sm">
            <Group gap="xs">
              <Text fw={600} size="sm">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Badge size="sm" variant="filled" color="blue">
                  {unreadCount} new
                </Badge>
              )}
            </Group>
            <Group gap="xs">
              <Button
                size="xs"
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkAllAsRead()
                }}
              >
                <IconCheck size={16} /> <Space w={4} />
                Mark all read
              </Button>
            </Group>
          </Group>

          <Divider />

          <ScrollArea h={400}>
            {notificationsList.length === 0 ? (
              <Stack align="center" justify="center" py="xl" gap="xs">
                <IconBell size={32} stroke={1.5} opacity={0.3} />
                <Text size="sm" c="dimmed">
                  No notifications yet
                </Text>
              </Stack>
            ) : (
              <Stack gap={0}>
                {notificationsList.map((notification) => {
                  const receiver = notification.notificationReceiver[0]
                  const isUnread = !receiver?.isRead

                  return (
                    <div
                      key={notification.id}
                      className={`cursor-pointer border-b border-gray-100 p-3 transition-colors hover:bg-gray-50 ${
                        isUnread ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        if (isUnread && receiver) {
                          handleMarkAsRead(notification.id)
                        }
                      }}
                    >
                      <Group align="flex-start" gap="sm" wrap="nowrap">
                        <div
                          className={`mt-1 rounded-full p-2 ${
                            notification.type === "order"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group justify="space-between" gap="xs">
                            <Text fw={600} size="sm" lineClamp={1}>
                              {notification.title}
                            </Text>
                            {isUnread && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                          </Group>

                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {notification.message}
                          </Text>

                          <Text size="xs" c="dimmed">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </Text>
                        </Stack>
                      </Group>
                    </div>
                  )
                })}
              </Stack>
            )}
          </ScrollArea>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
