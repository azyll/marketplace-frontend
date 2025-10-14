import { Card, Text, Skeleton, Stack, Badge, Group } from "@mantine/core"
import { IconAlertCircle, IconPackage, IconCheck, IconAlertTriangle } from "@tabler/icons-react"

interface AlertData {
  value: number
  label: string
}

interface AlertsCardProps {
  title: string
  data?: AlertData
  isLoading?: boolean
  description?: string
}

const getAlertIcon = (label: string) => {
  switch (label) {
    case "No Stock":
      return <IconAlertCircle size={20} color="red" />
    case "Low Stock":
      return <IconAlertTriangle size={20} color="orange" />
    case "In Stock":
      return <IconCheck size={20} color="green" />
  }
}

const getAlertColor = (label: string) => {
  switch (label) {
    case "No Stock":
      return "red"
    case "Low Stock":
      return "orange"
    case "In Stock":
      return "green"
    default:
      return "gray"
  }
}

export const AlertsCard = ({ title, data, isLoading, description }: AlertsCardProps) => {
  if (isLoading) {
    return (
      <Card p="lg" className="h-[146px] w-full max-w-lg">
        <Skeleton w={180} h={30} mb="md"></Skeleton>
        <Skeleton w={50} h={40} mb="md"></Skeleton>
        <Skeleton w={180} h={20}></Skeleton>
      </Card>
    )
  }

  const iconColor = data?.label ? getAlertColor(data.label) : "gray"

  return (
    <Card p="lg" className="h-[146px] w-full max-w-lg transition-all hover:shadow-md">
      <Stack gap="xs">
        <Group gap="xs" align="center">
          <div style={{ color: `var(--mantine-color-${iconColor}-6)` }}>
            {data?.label && getAlertIcon(data.label)}
          </div>
          <Text fw={600}>{title}</Text>
        </Group>

        <Text className="!text-3xl !font-bold">{data?.value ?? 0}</Text>

        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
    </Card>
  )
}
