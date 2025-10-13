import { IProductListFilters } from "@/types/product.type"
import { IOrderFilters, IOrderStatusType } from "@/types/order.type"
import { Button, CloseButton, ComboboxItem, Flex, Group, Input } from "@mantine/core"
import { ORDER_STATUS } from "@/constants/order"
import { KeyboardEvent, useMemo, useState } from "react"
import { DateInput, DatePicker, DatePickerInput } from "@mantine/dates"
import { IconCalendar, IconSearch } from "@tabler/icons-react"
import { useParams, useSearchParams } from "react-router"

type OrderFilterStatusType = IOrderStatusType | "all"

interface Props {
  filters: Partial<IOrderFilters>
  onFilter: (obj: Partial<IOrderFilters>) => void
  disabled?: boolean
}

export const OrdersFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IOrderFilters, value: unknown) => {
    onFilter({
      [key]: value,
      page: 1,
    })
  }

  const [search, setSearch] = useState<string>(filters?.search ?? "")

  const handleOnSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnFilter("search", search)
    }
  }

  const handleOnClearSearch = () => {
    setSearch("")
    handleOnFilter("search", undefined)
  }
  const [searchParams, setSearchParams] = useSearchParams()

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

  const initialStatus = useMemo(
    () => searchParams.get("status") as IOrderStatusType,
    [searchParams],
  )

  const [status, setStatus] = useState<OrderFilterStatusType>(
    initialStatus ?? (ORDER_STATUS.ONGOING as IOrderStatusType),
  )

  const handleOnSetStatus = (value: OrderFilterStatusType) => {
    onFilter({ status: value === "all" ? undefined : value })
    setStatus(value)
    setSearchParams({ status: value })
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

      <Flex gap={14}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleOnSearch}
          placeholder="# / Student / Program"
          w={260}
          leftSection={<IconSearch size={14} />}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => handleOnClearSearch()}
              style={{ display: filters.search ? undefined : "none" }}
            />
          }
          disabled={disabled}
        />

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
      </Flex>
    </Group>
  )
}
