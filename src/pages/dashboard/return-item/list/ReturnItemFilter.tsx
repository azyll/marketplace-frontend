import { IReturnItemFilters } from "@/types/return-item.type"
import { CloseButton, Group, Input, Select } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { KeyboardEvent, useMemo, useState } from "react"

interface Props {
  filters: Partial<IReturnItemFilters>
  onFilter: (obj: Partial<IReturnItemFilters>) => void
  disabled?: boolean
}

export const ReturnItemFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IReturnItemFilters, value: unknown) => {
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
  const statusOptions = useMemo(() => {
    return [
      {
        value: "active",
        label: "Active",
      },
      {
        value: "archived",
        label: "Archived",
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
          placeholder="Name / Reason"
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
          placeholder="Select Status"
          data={statusOptions ?? []}
          w={240}
          clearable
          clearButtonProps={{ "aria-label": "Clear input" }}
          onClear={() => handleOnFilter("status", null)}
          onChange={(value) => handleOnFilter("status", value)}
          disabled={disabled}
        />
      </div>
    </Group>
  )
}
