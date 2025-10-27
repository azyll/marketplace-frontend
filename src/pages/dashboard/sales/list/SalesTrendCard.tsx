import { Card, Text, Group, Badge, Stack, NumberFormatter, Skeleton } from "@mantine/core"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { getSalesTrend } from "@/services/sales.service"

export const SalesTrendCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales-trend"],
    queryFn: getSalesTrend,
  })

  const salesTrend = data?.data?.data
  if (isLoading || !salesTrend) {
    return (
      <Card p="lg">
        <Skeleton w={180} h={20} mb="md"></Skeleton>
        <div className="flex justify-between">
          <Skeleton w={160} h={40} mb="sm"></Skeleton>

          <Skeleton w={90} h={20} mb="md" radius="lg"></Skeleton>
        </div>

        <Skeleton w={140} h={15} mb="md"></Skeleton>
      </Card>
    )
  }

  const { previousMonth, currentMonth } = salesTrend
  const isIncrease = currentMonth.totalSales >= previousMonth.totalSales
  const Icon = isIncrease ? IconTrendingUp : IconTrendingDown
  const color = isIncrease ? "green" : "red"

  return (
    <Card p="lg" className="h-[47%] w-full transition-all hover:shadow-md">
      <Stack gap="xs">
        <Text fw={600}>Total Sales (This Month)</Text>

        <Group justify="space-between" align="center">
          <NumberFormatter
            decimalScale={2}
            fixedDecimalScale
            prefix="₱ "
            thousandSeparator=","
            value={currentMonth.totalSales}
            className="text-3xl font-bold"
          ></NumberFormatter>

          <Badge color={color} variant="light" leftSection={<Icon size={16} />}>
            {currentMonth.increasePercentage}
          </Badge>
        </Group>
        <Text size="xs" c="dimmed">
          Last month: ₱ {previousMonth.totalSales.toFixed(2)}
        </Text>
      </Stack>
    </Card>
  )
}
