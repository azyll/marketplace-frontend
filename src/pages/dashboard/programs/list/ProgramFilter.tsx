import { KEY } from "@/constants/key"
import { getProductDepartments } from "@/services/product-department.service"
import { IProgramsFilter } from "@/types/program.type"
import { CloseButton, ComboboxItem, Group, Input, OptionsFilter, Select } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { KeyboardEvent, useMemo, useState } from "react"

interface Props {
  filters: Partial<IProgramsFilter>
  onFilter: (obj: Partial<IProgramsFilter>) => void
  disabled?: boolean
}

export const ProgramFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IProgramsFilter, value: unknown) => {
    onFilter({
      [key]: value,
      page: 1,
    })
  }
  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getProductDepartments({ all: false, page: 1, limit: 100 }),
    select: (departments) => departments?.map(({ name }) => ({ label: name, value: name })),
  })

  const departmentOptionsFilter: OptionsFilter = ({ search }) => {
    if (!departmentOptions) return []

    const filtered = (departmentOptions as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
    )

    filtered.sort((a, b) => a.label.localeCompare(b.label))
    return filtered
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
          placeholder="Name / Acronym"
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

        {/* Department Filter */}
        <Select
          placeholder="Select Department"
          data={departmentOptions ?? []}
          w={280}
          filter={departmentOptionsFilter}
          clearable
          clearButtonProps={{ "aria-label": "Clear input" }}
          onClear={() => handleOnFilter("department", null)}
          onChange={(value) => handleOnFilter("department", value)}
          disabled={disabled || isDepartmentLoading}
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
