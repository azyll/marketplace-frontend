import { KEY } from "@/constants/key"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { getProductDepartments } from "@/services/product-department.service"
import { IInventoryFilter } from "@/types/product.type"
import {
  CloseButton,
  ComboboxItem,
  Group,
  Input,
  OptionsFilter,
  Select,
  Button,
  Indicator,
} from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { KeyboardEvent, useState } from "react"

type StockConditionType = "in-stock" | "low-stock" | "out-of-stock" | "all"

interface Props {
  filters: Partial<IInventoryFilter>
  onFilter: (obj: Partial<IInventoryFilter>) => void
  disabled?: boolean
}

export const InventoryFilter = ({ filters, onFilter, disabled }: Props) => {
  const handleOnFilter = (key: keyof IInventoryFilter, value: unknown) => {
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

  const [search, setSearch] = useState(filters?.name ?? "")

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
    { label: "Proware Item", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Fabric", value: PRODUCT_CATEGORY.FABRIC },
  ]

  const stockConditionOptions = [
    { label: "All", value: "all" },
    // { label: "In Stock", value: "in-stock" },
    { label: "Low Stock", value: "low-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
  ]

  const [stockCondition, setStockCondition] = useState<StockConditionType>(
    (filters?.stock_condition as StockConditionType) ?? "all",
  )

  const handleOnSetStockCondition = (value: StockConditionType) => {
    setStockCondition(value)
    onFilter({
      stock_condition: value === "all" ? undefined : (value as "low-stock" | "out-of-stock"),
    })
  }

  return (
    <Group
      gap="sm"
      justify="space-between"
      wrap="nowrap"
      className="hide-scrollbar mt-4 overflow-x-auto"
    >
      <div className="flex gap-2">
        {stockConditionOptions.map((option) => (
          <Button
            key={option.value}
            variant={stockCondition === option.value ? "filled" : "subtle"}
            c={stockCondition === option.value ? undefined : "gray"}
            onClick={() => handleOnSetStockCondition(option.value as StockConditionType)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Stock Condition Filter */}

      <div className="flex gap-3">
        {/* Search Name */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleOnSearch}
          placeholder="Product Name"
          w={200}
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

        {/* Department Filter */}
        <Select
          placeholder={isDepartmentLoading ? "Fetching Departments..." : "Select Department"}
          data={departmentOptions}
          filter={departmentOptionsFilter}
          nothingFoundMessage="Nothing found..."
          searchable
          w={260}
          clearable
          clearButtonProps={{
            "aria-label": "Clear input",
          }}
          onClear={() => handleOnFilter("department", null)}
          onChange={(value) => handleOnFilter("department", value)}
          disabled={isDepartmentLoading || disabled}
        />

        {/* Category Filter */}
        <Select
          placeholder="Select Category"
          data={categoryOptions}
          w={200}
          clearable
          clearButtonProps={{
            "aria-label": "Clear input",
          }}
          onClear={() => handleOnFilter("category", null)}
          onChange={(value) => handleOnFilter("category", value)}
          disabled={disabled}
        />
      </div>
    </Group>
  )
}
