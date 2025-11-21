import { dateFormat, DEFAULT_DATE_RANGE } from "@/constants/default-date"
import { IActivityLogFilters } from "@/types/activity-log"
import { IProgramsFilter } from "@/types/program.type"
import { CloseButton, ComboboxItem, Group, Input, OptionsFilter, Select } from "@mantine/core"
import { DatePickerInput, DatesRangeValue } from "@mantine/dates"
import { IconCalendar, IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { KeyboardEvent, useMemo, useState } from "react"

interface Props {
  filters: Partial<IActivityLogFilters>
  onFilter: (obj: Partial<IActivityLogFilters>) => void
  disabled?: boolean
}

export const ActivityLogFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IActivityLogFilters, value: unknown) => {
    onFilter({
      [key]: value,
      page: 1,
    })
  }
  const [search, setSearch] = useState(filters?.search ?? "")

  const handleOnSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnFilter("search", search)
    }
  }

  const handleOnClearSearch = () => {
    setSearch("")
    handleOnFilter("search", undefined)
  }

  const typeOptions = useMemo(() => {
    return [
      {
        value: "user",
        label: "User",
      },
      {
        value: "system",
        label: "System",
      },
      {
        value: "inventory",
        label: "Inventory",
      },
      {
        value: "sales",
        label: "Sales",
      },
      {
        value: "order",
        label: "Order",
      },
    ]
  }, [])
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
    <Group
      gap="sm"
      justify="space-between"
      wrap="nowrap"
      className="hide-scrollbar mt-4 overflow-x-auto"
    >
      <div className="flex gap-3">
        {/* Search Name */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleOnSearch}
          placeholder="Title / Content"
          w={280}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={handleOnClearSearch}
              style={{ display: search ? undefined : "none" }}
            />
          }
          leftSection={<IconSearch size={14} />}
          disabled={disabled}
        />

        <Select
          placeholder="Select Type"
          data={typeOptions ?? []}
          w={240}
          clearable
          clearButtonProps={{ "aria-label": "Clear input" }}
          onClear={() => handleOnFilter("type", null)}
          onChange={(value) => handleOnFilter("type", value)}
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
      </div>
    </Group>
  )
}
