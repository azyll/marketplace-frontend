import { IProductListFilters } from "@/types/product.type"
import { CloseButton, ComboboxItem, Group, Input, OptionsFilter, Select } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { KeyboardEvent, useState } from "react"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { IconSearch } from "@tabler/icons-react"

interface Props {
  filters: IProductListFilters
  onFilter: (obj: Partial<IProductListFilters>) => void
  disabled?: boolean
}
export const ProductFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IProductListFilters, value: unknown) => {
    onFilter({
      [key]: value,
      page: 1,
    })
  }

  const { data: programOptions, isLoading: isProgramsLoading } = useQuery({
    queryKey: [KEY.PROGRAMS],
    queryFn: () => getPrograms({ page: 1, limit: 100 }),
    select: (response) => response?.data?.map(({ name, id }) => ({ label: name, value: id })),
  })

  const programOptionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
    )

    filtered.sort((a, b) => a.label.localeCompare(b.label))
    return filtered
  }

  const [search, setSearch] = useState<string>(filters?.name ?? "")

  const handleOnSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnFilter("name", search)
    }
  }

  const handleOnClearSearch = () => {
    setSearch("")
    handleOnFilter("name", undefined)
  }

  const categoryOptions: ComboboxItem[] = [
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Accessory", value: PRODUCT_CATEGORY.ACCESSORY },
    { label: "Stationery", value: PRODUCT_CATEGORY.STATIONERY },
  ]

  return (
    <Group gap="sm" wrap="nowrap" className="hide-scrollbar mt-4 overflow-x-auto">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleOnSearch}
        placeholder="Product Name"
        w={260}
        rightSectionPointerEvents="all"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => handleOnClearSearch()}
            style={{ display: filters.name ? undefined : "none" }}
          />
        }
        leftSection={<IconSearch size={14} />}
        disabled={disabled}
      />

      <Select
        placeholder={isProgramsLoading ? "Fetching Programs..." : "Select Program"}
        data={programOptions}
        filter={programOptionsFilter}
        nothingFoundMessage="Nothing found..."
        searchable
        w={280}
        clearable
        clearButtonProps={{
          "aria-label": "Clear input",
        }}
        onClear={() => handleOnFilter("department", null)}
        onChange={(value) => handleOnFilter("department", value)}
        disabled={isProgramsLoading || disabled}
      />

      <Select
        placeholder="Select Category"
        data={categoryOptions}
        w={260}
        clearable
        clearButtonProps={{
          "aria-label": "Clear input",
        }}
        onClear={() => handleOnFilter("category", null)}
        onChange={(value) => handleOnFilter("category", value)}
        disabled={disabled}
      />
    </Group>
  )
}
