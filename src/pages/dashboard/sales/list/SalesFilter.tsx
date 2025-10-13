import { CloseButton, Group, Input } from "@mantine/core"
import { KeyboardEvent, useState } from "react"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar, IconSearch } from "@tabler/icons-react"
import { ISalesFilter } from "@/types/sale.type"

interface Props {
  filters: Partial<ISalesFilter>
  onFilter: (obj: Partial<ISalesFilter>) => void
  disabled?: boolean
}

export const SalesFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof ISalesFilter, value: unknown) => {
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

  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null])

  const handleOnDateRangeChange = (dateRange: [string | null, string | null]) => {
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
        valueFormat="MM/DD/YY"
      />
    </Group>
  )
}
