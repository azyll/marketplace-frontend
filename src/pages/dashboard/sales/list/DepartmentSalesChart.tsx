import { Card, Center, Loader, Skeleton, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { getDepartments } from "@/services/department.service"
import { getSalesPerDepartment } from "@/services/sales.service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export const DepartmentSalesChart = () => {
  const { data: deptRes, isLoading: deptLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => await getDepartments({ all: "true" }),
  })

  const { data: salesRes, isLoading: salesLoading } = useQuery({
    queryKey: ["department-sales"],
    queryFn: getSalesPerDepartment,
  })

  const isLoading = deptLoading || salesLoading

  const departments = deptRes?.data || []
  const salesData = salesRes?.data.data || []

  const salesMap = Object.fromEntries(salesData.map((s: any) => [s.acronym, s.totalSales]))

  const chartData = departments.map((dept: any) => ({
    department: dept.acronym.toUpperCase(),
    departmentName: dept.name,
    sales: salesMap[dept.acronym] ?? 0,
  }))

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `₱${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `₱${(value / 1000).toFixed(0)}K`
    }
    return `₱${value}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card p="xs" withBorder shadow="sm">
          <Text fw={600} size="sm">
            {payload[0].payload.departmentName}
          </Text>
          <Text size="sm" mt={2}>
            ₱ {payload[0].value.toFixed(2)}
          </Text>
        </Card>
      )
    }
    return null
  }

  return (
    <Card withBorder mx={9} p={0}>
      {isLoading ? (
        <Skeleton h={250} />
      ) : chartData.length === 0 ? (
        <Center py="md">
          <Text size="sm" c="dimmed">
            No sales data available
          </Text>
        </Center>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis dataKey="department" tick={{ fontSize: 12 }} stroke="#666" />

            <YAxis width={30} tick={{ fontSize: 12 }} stroke="#666" tickFormatter={formatYAxis} />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />

            <Bar dataKey="sales" fill="#228be6" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
