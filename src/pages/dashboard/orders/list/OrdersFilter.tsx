import { IProductListFilters } from "@/types/product.type"
import { IOrderFilters, IOrderStatusType } from "@/types/order.type"
import { Button, ComboboxItem, Group } from "@mantine/core"
import { ORDER_STATUS } from "@/constants/order"
import { useState } from "react"
import { DateInput, DatePicker, DatePickerInput } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"

type OrderFilterStatusType = IOrderStatusType | "all"

interface Props {
  filters: Partial<IOrderFilters>
  onFilter: (obj: Partial<IOrderFilters>) => void
  disabled?: boolean
}

export const OrdersFilter = ({ filters, onFilter, disabled }: Props) => {
  const statusOptions: ComboboxItem[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Ongoing",
      value: ORDER_STATUS.ONGOING,
    },
    {
      label: "Confirmed",
      value: ORDER_STATUS.CONFIRMED,
    },
    {
      label: "Completed",
      value: ORDER_STATUS.COMPLETED,
    },
    {
      label: "Cancelled",
      value: ORDER_STATUS.CANCELLED,
    },
  ]

  const [status, setStatus] = useState<OrderFilterStatusType>("all")

  const handleOnSetStatus = (value: OrderFilterStatusType) => {
    onFilter({ status: value === "all" ? undefined : value })
    setStatus(value)
  }

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
      <div className="flex gap-2">
        {statusOptions.map((option, i) => (
          <Button
            key={option.value}
            variant={status === option.value ? "filled" : "subtle"}
            c={status === option.value ? undefined : "gray"}
            onClick={() => handleOnSetStatus(option.value as OrderFilterStatusType)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </div>

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
