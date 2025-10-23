import { IActivityLogFilters } from "@/types/activity-log"
import { IProgramsFilter } from "@/types/program.type"
import { CloseButton, ComboboxItem, Group, Input, OptionsFilter, Select } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
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
      </div>
    </Group>
  )
}
