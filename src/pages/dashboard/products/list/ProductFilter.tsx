import { IProductListFilters } from "@/types/product.type"
import { CloseButton, ComboboxItem, Group, Input, OptionsFilter, Select } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { KeyboardEvent, useState } from "react"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { IconSearch } from "@tabler/icons-react"
import { getProductDepartments } from "@/services/product-department.service"

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

  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getProductDepartments(),
    select: (departments) => departments?.map(({ name, id }) => ({ label: name, value: id })),
  })

  const departmentOptionsFilter: OptionsFilter = ({ search }) => {
    if (!departmentOptions) return []

    const filtered = (departmentOptions as ComboboxItem[]).filter((option) =>
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
        placeholder={isDepartmentLoading ? "Fetching Departments..." : "Select Department"}
        data={departmentOptions}
        filter={departmentOptionsFilter}
        nothingFoundMessage="Nothing found..."
        searchable
        w={280}
        clearable
        clearButtonProps={{
          "aria-label": "Clear input",
        }}
        onClear={() => handleOnFilter("departmentId", null)}
        onChange={(value) => handleOnFilter("departmentId", value)}
        disabled={isDepartmentLoading || disabled}
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
