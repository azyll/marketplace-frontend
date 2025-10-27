import { KEY } from "@/constants/key"
import { getRoles } from "@/services/role.service"
import { IRole } from "@/types/role.type"
import { IUserFilters } from "@/types/user.type"
import { CloseButton, Group, Input, Select } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { KeyboardEvent, useState } from "react"

interface Props {
  filters: Partial<IUserFilters>
  onFilter: (obj: Partial<IUserFilters>) => void
  disabled?: boolean
}

export const UsersFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IUserFilters, value: unknown) => {
    onFilter({
      [key]: value,
      page: 1,
    })
  }

  const { data: roleOptions, isLoading } = useQuery({
    queryKey: [KEY.ROLES],
    queryFn: () => getRoles(filters),
    select: (res) =>
      res?.data.map((role: IRole) => ({
        value: role.id,
        label: role.name,
      })),
  })

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
          placeholder="User Name"
          w={260}
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

        {/* Role Filter */}
        <Select
          placeholder="Select Role"
          data={roleOptions ?? []}
          w={200}
          clearable
          clearButtonProps={{ "aria-label": "Clear input" }}
          onClear={() => handleOnFilter("role", null)}
          onChange={(value) => handleOnFilter("role", value)}
          disabled={disabled || isLoading}
        />
      </div>
    </Group>
  )
}
