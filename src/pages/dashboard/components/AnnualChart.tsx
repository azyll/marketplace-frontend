import { useQuery } from "@tanstack/react-query"
import { LineChart } from "@mantine/charts"
import { Paper, Skeleton, Text } from "@mantine/core"

interface AnnualChartProps {
  queryKey: string
  queryFn: () => Promise<any>
  label: string
  dataKey: string
}

const AnnualChart = ({ queryKey, queryFn, label, dataKey }: AnnualChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn,
  })

  const chartData = data?.data.data.map((item: { month: string; count: number }) => ({
    month: item.month,
    [dataKey]: item.count,
  }))

  return (
    <section>
      {isLoading ? (
        <Skeleton h={300} />
      ) : (
        <LineChart
          h={300}
          data={chartData}
          dataKey="month"
          series={[{ name: dataKey, label, color: "blue" }]}
          withXAxis
          withYAxis
          withTooltip
          tooltipAnimationDuration={150}
          tooltipProps={{
            content: ({ label: monthLabel, payload }) => {
              if (!payload?.length) return null
              const { value } = payload[0]
              return (
                <Paper p="sm" shadow="sm" radius="md" withBorder bg="white">
                  <Text fw={500}>{monthLabel}</Text>
                  <Text c="blue" fz="sm">
                    {label}: {value}
                  </Text>
                </Paper>
              )
            },
          }}
        />
      )}
    </section>
  )
}

export default AnnualChart
