import { IRoleFilters } from "@/types/role.type"
import { CloseButton, Group, Input } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { KeyboardEvent, useState } from "react"

interface Props {
  filters: Partial<IRoleFilters>
  onFilter: (obj: Partial<IRoleFilters>) => void
  disabled?: boolean
}

export const RoleFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IRoleFilters, value: unknown) => {
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
          placeholder="Name"
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
      </div>
    </Group>
  )
}
