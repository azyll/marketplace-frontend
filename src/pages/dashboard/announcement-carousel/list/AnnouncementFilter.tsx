import { CloseButton, Group, Input, Select } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { KeyboardEvent, useMemo, useState } from "react"

interface IAnnouncementFilters {
  status?: "active" | "archived"
  page?: number
  limit?: number
  search?: string
}

interface Props {
  filters: Partial<IAnnouncementFilters>
  onFilter: (obj: Partial<IAnnouncementFilters>) => void
  disabled?: boolean
}

export const AnnouncementFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IAnnouncementFilters, value: unknown) => {
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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleOnSearch}
          placeholder="Title / Message"
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
          data={statusOptions}
          value={filters.status}
          w={240}
          clearable
          clearButtonProps={{ "aria-label": "Clear status filter" }}
          onClear={() => handleOnFilter("status", undefined)} // Changed from null to undefined
          onChange={(value) => handleOnFilter("status", value as "active" | "archived" | undefined)} // Changed to undefined
          disabled={disabled}
        />
      </div>
    </Group>
  )
}
