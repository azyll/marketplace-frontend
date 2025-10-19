import { Badge, Card, Group, Text, Timeline, Skeleton, ScrollArea } from "@mantine/core"
import { IconCircleDot, IconMoodSad } from "@tabler/icons-react"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { getLogs } from "@/services/notification.service"
import { ILog } from "@/types/notification.type"
import { replace, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

dayjs.extend(relativeTime)

interface LogsProps {
  type: string
  limit?: number
  height?: number
}

export const LogsCard = ({ type, limit = 5, height = 250 }: LogsProps) => {
  const DEFAULT_PAGE = 1

  const [filters] = useFilters({
    page: DEFAULT_PAGE,
    limit,
  })

  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs", type, filters],
    queryFn: () => getLogs(type),
  })

  const logData = logs?.data?.data ?? []

  const navigate = useNavigate()

  return (
    <Card mx={9} h={height} withBorder p="md" className="h-full flex-1" style={{ minWidth: 0 }}>
      {/* <Group justify="space-between" mb="xs" wrap="nowrap"> */}
      {/* <Badge variant="light" size="sm">
          {logData.length >= 9 ? "9+" : logData.length}
        </Badge> */}
      {/* </Group> */}

      {isLoading ? (
        <Skeleton height={height} radius="md" />
      ) : logData.length === 0 ? (
        <div className="flex h-[120px] flex-col items-center justify-center">
          <IconMoodSad size={32} stroke={1.5} className="text-neutral-400" />
          <Text size="xs" c="dimmed" mt="xs">
            No logs found
          </Text>
        </div>
      ) : (
        <ScrollArea h={height} scrollbarSize={4} scrollHideDelay={500}>
          <Timeline active={-1} bulletSize={12} lineWidth={2}>
            {logData.slice(0, limit).map((log: ILog) => (
              <Timeline.Item key={log.id} bullet={<IconCircleDot size={8} />} className="pb-1">
                <Group
                  className="cursor-pointer"
                  justify="space-between"
                  align="start"
                  gap="xs"
                  wrap="nowrap"
                  onClick={() => {
                    switch (type) {
                      case "sales": {
                        const invoice =
                          log.content.match(/Oracle Invoice Number:\s*(.+)/)?.[1] ?? ""
                        navigate(ROUTES.DASHBOARD.SALES.ID.replace(":salesId", invoice))
                        break
                      }
                      case "order": {
                        const order = log.content.match(/(?:Order #|ID:\s*)(ORD-[\d-]+)/)?.[1] ?? ""

                        navigate(ROUTES.DASHBOARD.ORDERS.ID.replace(":orderId", order))
                        break
                      }

                      case "inventory": {
                      }
                      case "user": {
                      }
                    }
                  }}
                >
                  <div className="min-w-0">
                    <Text fw={500} size="xs" lineClamp={1}>
                      {log.title}
                    </Text>

                    <Text size="xs" c="dimmed" lineClamp={2} mt={2}>
                      {log.content}
                    </Text>
                  </div>
                  <Text size="xs" c="dimmed" ta="right" style={{ flexShrink: 0 }}>
                    {dayjs(log.createdAt).fromNow()}
                  </Text>
                </Group>
              </Timeline.Item>
            ))}
          </Timeline>
        </ScrollArea>
      )}
    </Card>
  )
}
