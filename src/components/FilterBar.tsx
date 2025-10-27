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
import { useSearchParams } from "react-router"

interface Props {
  onCategorySelect: (category: string) => void
  onProgramSelect: (department: string | null) => void
  departments?: IDepartment
}

export default function FilterBar({ onCategorySelect, onProgramSelect, departments }: Props) {
  const user = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL parameters with proper null checking
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || "all",
  )
  const [selectedProgram, setSelectedProgram] = useState<string | null>(
    searchParams.get("department") || user.user?.student?.program?.department?.name || null,
  )

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getProductDepartments({ all: false, page: 1, limit: 100 }),
    select: (departments) =>
      departments
        ?.map(({ name, id, program }) => ({
          label: name,
          value: id,
          acronyms: program?.map((p) => p.acronym.toUpperCase()) ?? [],
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
  })

  const categoryOptions = [
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Fabric", value: PRODUCT_CATEGORY.FABRIC },
  ]

  // Update URL when filters change
  const updateSearchParams = (category: string | null, department: string | null) => {
    const newParams = new URLSearchParams(searchParams)

    if (category) {
      newParams.set("category", category)
    } else {
      newParams.delete("category")
    }

    if (department) {
      newParams.set("department", department)
    } else {
      newParams.delete("department")
    }

    setSearchParams(newParams)
  }

  const handleOnClickCategory = (category: string) => {
    let newCategory: string

    // Toggle behavior: if same category is clicked, deselect it
    if (selectedCategory === category) {
      newCategory = "all"
      setSelectedCategory("all")
    } else {
      newCategory = category
      setSelectedCategory(category)
    }

    onCategorySelect(newCategory)
    updateSearchParams(newCategory, selectedProgram)
  }

  const handleOnSelectDepartment = (department: string) => {
    setSelectedProgram(department)
    onProgramSelect(department)
    updateSearchParams(selectedCategory, department)
    combobox.closeDropdown()
  }

  const handleOnClearSearch = () => {
    setSelectedProgram(null)
    onProgramSelect(null)
    updateSearchParams(selectedCategory, null)
  }

  // Initialize filters on component mount
  useEffect(() => {
    if (selectedCategory) {
      onCategorySelect(selectedCategory)
    }
    if (selectedProgram) {
      onProgramSelect(selectedProgram)
    }
  }, [])

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

  // Check if user is a student
  const isStudent = user.user?.student != null

  return (
    <Group gap="sm" wrap="nowrap" className="hide-scrollbar overflow-x-auto">
      {/* Department Filter Combobox*/}

      <Combobox
        width={220}
        store={combobox}
        position="bottom-start"
        onOptionSubmit={handleOnSelectDepartment}
        disabled={isStudent && !!user.user?.student?.program?.department?.name}
      >
        <Combobox.Target>
          <InputBase
            w={210}
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
              !isStudent ? (
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
              ) : null
            }
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents={selectedProgram === null ? "none" : "all"}
            className="shrink-0"
            style={{
              minWidth: "200px",
              textAlign: "left",
              transition: "all 1s ease",
            }}
          >
            {selectedProgram ? (
              <Text truncate="end" title={selectedProgram} size="sm">
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
