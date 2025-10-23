import { CloseButton, Group, Input } from "@mantine/core"
import { KeyboardEvent, useMemo, useState } from "react"
import { DatePickerInput, DatesRangeValue } from "@mantine/dates"
import { IconCalendar, IconSearch } from "@tabler/icons-react"
import { ISalesFilter } from "@/types/sales.type"
import dayjs from "dayjs"

const dateFormat = "YYYY-MM-DD"

const DEFAULT_DATE_RANGE = {
  from: dayjs().subtract(1, "month").format(dateFormat),
  to: dayjs().format(dateFormat),
}

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

  const [dateRange, setDateRange] = useState<DatesRangeValue<string>>([
    filters?.from ?? null,
    filters?.to ?? null,
  ])

  const handleOnDateRangeChange = (dateRange: DatesRangeValue<string>) => {
    if (dateRange[1] || (!dateRange[1] && !dateRange[0])) {
      onFilter({
        from: dateRange?.[0] ?? DEFAULT_DATE_RANGE.from,
        to: dateRange?.[1] ?? DEFAULT_DATE_RANGE.to,
      })
    }

    if (!dateRange[1] && !dateRange[0]) {
      setDateRange([DEFAULT_DATE_RANGE.from, DEFAULT_DATE_RANGE.to])
    } else setDateRange([dateRange?.[0], dateRange?.[1]])
  }

  const isDateDefault = useMemo(
    () => dateRange[0] === DEFAULT_DATE_RANGE.from && dateRange[1] === DEFAULT_DATE_RANGE.to,
    [dateRange],
  )

  const currentDate = dayjs()
  const yesterday = dayjs().subtract(1, "day")

  return (
    <Group gap="sm" wrap="nowrap" className="hide-scrollbar mt-4 overflow-x-auto" align="center">
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
        clearable={!isDateDefault}
        disabled={disabled}
        miw={200}
        valueFormat="MMM DD, YYYY"
        presets={[
          {
            value: [currentDate.format(dateFormat), currentDate.format(dateFormat)],
            label: "Today",
          },
          {
            value: [yesterday.format(dateFormat), yesterday.format(dateFormat)],
            label: "Yesterday",
          },
          {
            value: [
              currentDate.startOf("week").format(dateFormat),
              currentDate.endOf("week").format(dateFormat),
            ],
            label: "This Week",
          },
          {
            value: [
              currentDate.startOf("month").format(dateFormat),
              currentDate.endOf("month").format(dateFormat),
            ],
            label: "This Month",
          },
          {
            value: [
              currentDate.startOf("year").format(dateFormat),
              currentDate.endOf("year").format(dateFormat),
            ],
            label: "This Year",
          },
          {
            value: [
              currentDate.subtract(1, "year").startOf("year").format(dateFormat),
              currentDate.subtract(1, "year").endOf("year").format(dateFormat),
            ],
            label: "Last Year",
          },
        ]}
      />
    </Group>
  )
}
