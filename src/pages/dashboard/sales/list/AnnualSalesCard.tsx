import { Card, Text, NumberFormatter } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { getSales } from "@/services/sales.service"
import { useFilters } from "@/hooks/useFilters"

export const AnnualSalesCard = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters] = useFilters({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["sales", "annual", filters],
    queryFn: () => getSales(filters || {}),
  })

  const totalSales = data?.meta?.totalSales

  if (isLoading || totalSales === undefined) {
    return (
      <Card p="lg">
        <Text c="dimmed">Loading...</Text>
      </Card>
    )
  }

  return (
    <Card p="lg" className="h-[146px] w-full max-w-lg transition-all hover:shadow-md">
      <Text fw={600} mb="md">
        Total Sales (This Year)
      </Text>

      <NumberFormatter
        decimalScale={2}
        fixedDecimalScale
        prefix="₱ "
        thousandSeparator=","
        value={totalSales}
        className="text-3xl font-bold"
      />
    </Card>
  )
}
