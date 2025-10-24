import { Group, Select } from "@mantine/core"
import { useMemo } from "react"

interface IAnnouncementFilters {
  status?: "active" | "archived" | null
  page?: number
  limit?: number
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
        <Select
          placeholder="Select Status"
          data={statusOptions}
          value={filters.status}
          w={240}
          clearable
          clearButtonProps={{ "aria-label": "Clear status filter" }}
          onClear={() => handleOnFilter("status", null)}
          onChange={(value) => handleOnFilter("status", value as "active" | "archived" | null)}
          disabled={disabled}
        />
      </div>
    </Group>
  )
}
