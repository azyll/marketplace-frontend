import {
  Button,
  Group,
  Combobox,
  useCombobox,
  InputBase,
  CheckIcon,
  CloseButton,
  Input,
} from "@mantine/core"
import { PRODUCT_CATEGORY } from "@/constants/product"
import { useContext, useEffect, useState } from "react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { AuthContext } from "@/contexts/AuthContext"

interface CategoryOption {
  label: string
  value: string
}

interface ProgramOption {
  label: string
}

interface Props {
  categoryValue?: string
  programValue?: string // Add this prop
  onCategorySelect: (category: string | null) => void
  onProgramSelect: (program: string | null) => void
  programs?: ProgramOption[]
}

export default function FilterBar({
  onCategorySelect,
  onProgramSelect,
  categoryValue,
  programValue, // Add this prop
  programs = [],
}: Props) {
  const user = useContext(AuthContext)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  // Default programs if not provided
  const defaultPrograms: ProgramOption[] = [
    { label: "Arts & Sciences" },
    { label: "Business & Management" },
    { label: "Hospitality Management" },
    { label: "Information and Communication Technology" },
    { label: "Senior High School" },
    { label: "Tourism Management" },
  ]

  const programOptions = programs.length > 0 ? programs : defaultPrograms

  const categoryOptions: CategoryOption[] = [
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Accessory", value: PRODUCT_CATEGORY.ACCESSORY },
    { label: "Stationery", value: PRODUCT_CATEGORY.STATIONERY },
  ]

  const handleCategoryClick = (category: string) => {
    // Toggle behavior: if same category is clicked, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null)
      onCategorySelect(null)
    } else {
      setSelectedCategory(category)
      onCategorySelect(category)
    }
  }

  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program)
    onProgramSelect(program)
    combobox.closeDropdown()
  }

  const handleProgramClear = () => {
    setSelectedProgram(null)
    onProgramSelect(null)
  }

  // Sync with external state changes for category
  useEffect(() => {
    if (categoryValue !== undefined && categoryValue !== selectedCategory) {
      setSelectedCategory(categoryValue)
    }
  }, [categoryValue])

  // Sync with external state changes for program
  useEffect(() => {
    if (programValue !== undefined && programValue !== selectedProgram) {
      setSelectedProgram(programValue)
    }
  }, [programValue])

  const options = programOptions.map((item) => (
    <Combobox.Option value={item.label} key={item.label}>
      <Group gap="xs">
        {selectedProgram === item.label && <CheckIcon size={12} />}
        <div>
          <div>{item.label}</div>
        </div>
      </Group>
    </Combobox.Option>
  ))

  return (
    <Group gap="sm" wrap="nowrap" className="hide-scrollbar overflow-x-auto">
      {/* Program Filter Combobox*/}
      {!user.user?.student ? (
        <Combobox
          store={combobox}
          width={280}
          position="bottom-start"
          withArrow
          onOptionSubmit={handleProgramSelect}
        >
          <Combobox.Target>
            <InputBase
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
                    onClick={handleProgramClear}
                    aria-label="Clear program selection"
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
              {selectedProgram || <Input.Placeholder>Select Program</Input.Placeholder>}
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
          onClick={() => handleCategoryClick(value)}
        >
          {label}
        </Button>
      ))}
    </Group>
  )
}
