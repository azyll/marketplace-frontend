import {
  Button,
  Group,
  Combobox,
  useCombobox,
  InputBase,
  CheckIcon,
  CloseButton,
  Input,
  Text,
} from "@mantine/core"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { useContext, useEffect, useState } from "react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { AuthContext } from "@/contexts/AuthContext"
import { KEY } from "@/constants/key"
import { getProductDepartments } from "@/services/product-department.service"
import { useQuery } from "@tanstack/react-query"
import { IDepartment } from "@/types/department.type"

interface CategoryOption {
  label: string
  value: string
}

interface DepartmentOption {
  label: string
  value: string
  acronyms: string[]
}

interface Props {
  onCategorySelect: (category: string | null) => void
  onProgramSelect: (department: string | null) => void
  departments?: IDepartment
}

export default function FilterBar({ onCategorySelect, onProgramSelect, departments }: Props) {
  const user = useContext(AuthContext)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getProductDepartments(),
    select: (departments) =>
      departments
        ?.map(({ name, id, program }) => ({
          label: name,
          value: id,
          acronyms: program?.map((p) => p.acronym.toUpperCase()) ?? [],
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
  })

  const categoryOptions: CategoryOption[] = [
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Accessory", value: PRODUCT_CATEGORY.ACCESSORY },
    { label: "Stationery", value: PRODUCT_CATEGORY.STATIONERY },
  ]

  const handleOnClickCategory = (category: string) => {
    // Toggle behavior: if same category is clicked, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null)
      onCategorySelect(null)
    } else {
      setSelectedCategory(category)
      onCategorySelect(category)
    }
  }

  const handleOnSelectDepartment = (department: string) => {
    setSelectedProgram(department)
    onProgramSelect(department)
    combobox.closeDropdown()
  }

  const handleOnClearSearch = () => {
    setSelectedProgram(null)
    onProgramSelect(null)
  }

  const options = departmentOptions?.map((item) => (
    <Combobox.Option value={item.label} key={item.label} style={{ padding: "8px 12px" }}>
      <Group gap="xs">
        {selectedProgram === item.label && <CheckIcon size={12} />}
        <div style={{ lineHeight: 1.2, flex: 1, minWidth: 0 }}>
          <Text
            size="sm"
            fw={500}
            truncate="end"
            title={item.label}
            style={{ marginBottom: "1px" }}
          >
            {item.label}
          </Text>
          <div
            style={{
              fontSize: "11px",
              color: "#868e96",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.acronyms.join(" • ")}
          </div>
        </div>
      </Group>
    </Combobox.Option>
  ))

  return (
    <Group gap="sm" wrap="nowrap" className="hide-scrollbar overflow-x-auto">
      {/* Department Filter Combobox*/}
      {!user.user?.student ? (
        <Combobox
          store={combobox}
          width={250}
          position="bottom-start"
          onOptionSubmit={handleOnSelectDepartment}
        >
          <Combobox.Target>
            <InputBase
              w={250}
              radius="xl"
              variant="filled"
              component="button"
              type="button"
              pointer
              styles={{
                input: {
                  backgroundColor: "#E9EDF3",
                },
              }}
              rightSection={
                selectedProgram !== null ? (
                  <CloseButton
                    size="sm"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleOnClearSearch}
                    aria-label="Clear department selection"
                  />
                ) : (
                  <IconChevronDown size={14} />
                )
              }
              onClick={() => combobox.toggleDropdown()}
              rightSectionPointerEvents={selectedProgram === null ? "none" : "all"}
              className="shrink-0"
              style={{
                minWidth: "200px",
                borderRadius: "9999px", // xl radius
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              {selectedProgram ? (
                <Text truncate="end" title={selectedProgram} style={{ textAlign: "left" }}>
                  {selectedProgram}
                </Text>
              ) : (
                <Input.Placeholder>Select Program</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      ) : (
        <></>
      )}

      {/* Category Filter Buttons */}
      {categoryOptions.map(({ label, value }) => (
        <Button
          key={value}
          className="shrink-0"
          variant={selectedCategory === value ? "filled" : "default"}
          radius="xl"
          fw="400"
          onClick={() => handleOnClickCategory(value)}
        >
          {label}
        </Button>
      ))}
    </Group>
  )
}
