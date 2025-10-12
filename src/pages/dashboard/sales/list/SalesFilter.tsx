import { Group } from "@mantine/core"
import { useState } from "react"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"
import { useSearchParams } from "react-router"
import { ISalesFilter } from "@/types/sale.type"

interface Props {
  filters: Partial<ISalesFilter>
  onFilter: (obj: Partial<ISalesFilter>) => void
  disabled?: boolean
}

export const SalesFilter = ({ filters, onFilter, disabled }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null])

  const handleOnDateRangeChange = (dateRange: [string | null, string | null]) => {
    // Yung condition na to para ma trigger lang yung pag filter pag naka pili na ng date range or null yung both value
    if (dateRange[1] || (!dateRange[1] && !dateRange[0])) {
      onFilter({
        from: dateRange?.[0] ?? undefined,
        to: dateRange?.[1] ?? undefined,
      })
    }

    setDateRange(dateRange)
  }

  return (
    <Group
      gap="sm"
      wrap="nowrap"
      className="hide-scrollbar mt-4 overflow-x-auto"
      justify="space-between"
      align="center"
    >
      <div>
        <DatePickerInput
          leftSection={<IconCalendar size={16} />}
          type="range"
          allowSingleDateInRange
          value={dateRange}
          onChange={handleOnDateRangeChange}
          placeholder="Select Date Range"
          clearable
          disabled={disabled}
          miw={220}
          valueFormat="MMM DD YYYY"
        />
      </div>
    </Group>
  )
}
