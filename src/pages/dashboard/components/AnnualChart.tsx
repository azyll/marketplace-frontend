import { useQuery } from "@tanstack/react-query"
import { Card, Skeleton, Text } from "@mantine/core"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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

  const chartData = data?.data.data.map((item: { month: string; count: string }) => ({
    month: item.month,
    [dataKey]: Number(item.count), // Convert string to number!
  }))

  const formatValue = (value: any) => {
    const numValue = typeof value === "number" ? value : Number(value)
    if (isNaN(numValue)) return value

    if (dataKey === "sales") {
      return `₱ ${numValue.toFixed(2)}`
    }
    return numValue
  }

  const formatYAxis = (value: any) => {
    const num = Number(value)
    if (isNaN(num)) return value

    if (dataKey === "sales") {
      if (num >= 1000000) {
        return `₱${(num / 1000000).toFixed(1)}M`
      }
      if (num >= 1000) {
        return `₱${(num / 1000).toFixed(0)}K`
      }
      return `₱${num}`
    }
    return num
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card p="xs" withBorder shadow="sm">
          <Text fw={600} size="sm">
            {payload[0].payload.month}
          </Text>
          <Text size="sm" mt={2}>
            {formatValue(payload[0].value)}
          </Text>
        </Card>
      )
    }
    return null
  }

  return (
    <section>
      {isLoading ? (
        <Skeleton h={250} />
      ) : (
        <Card mx={9} withBorder p={0}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />

              <YAxis
                domain={[0, "auto"]}
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={dataKey === "sales" ? formatYAxis : undefined}
                width={30}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#228be6"
                strokeWidth={2}
                dot={{ r: 4, fill: "white", strokeWidth: 2, stroke: "#228be6" }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </section>
  )
}

export default AnnualChart
