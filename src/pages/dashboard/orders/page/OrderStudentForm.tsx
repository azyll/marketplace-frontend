import {
  Combobox,
  ComboboxItem,
  Grid,
  LoadingOverlay,
  OptionsFilter,
  Select,
  SelectProps,
  Text,
  TextInput,
  Title,
  useCombobox,
} from "@mantine/core"
import { Ref, useEffect, useImperativeHandle, useState } from "react"
import { IStudent } from "@/types/student.type"
import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateOrderStudentCreateInput, ICreateOrderStudentInput } from "@/types/order.type"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { getAllStudents } from "@/services/student.service"
import { useDebouncedState } from "@mantine/hooks"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createOrderStudentSchema } from "@/schema/order.schema"

export interface OrderStudentFormRef {
  form: UseFormReturnType<Partial<ICreateOrderStudentInput>>
}

interface Props {
  ref: Ref<OrderStudentFormRef>
  disabled?: boolean
}

export const OrderStudentForm = ({ ref, disabled }: Props) => {
  const form = useForm<Partial<ICreateOrderStudentCreateInput>>({
    initialValues: {
      studentNumber: undefined,
    },
    validate: zod4Resolver(createOrderStudentSchema),
  })

  const [studentDebouncedSearch, setStudentDebouncedSearch] = useDebouncedState("", 300)
  const [studentSearch, setStudentSearch] = useState<string>()
  const [selectedStudent, setSelectedStudent] = useState<IStudent>()

  useEffect(() => {
    const studentSearchValue = `${selectedStudent?.user.fullName} (${selectedStudent?.id})`

    if (selectedStudent && studentSearch !== studentSearchValue) {
      setSelectedStudent(undefined)
    }

    setStudentDebouncedSearch(studentSearch ?? "")
  }, [studentSearch])

  const { data: students, isLoading: isStudentLoading } = useQuery({
    queryKey: [KEY.STUDENTS.ALL, studentDebouncedSearch],
    queryFn: () => getAllStudents({ q: studentDebouncedSearch, page: 1, limit: 20 }),
  })

  const handleOnSelectStudent = (studentId: string) => {
    const student = students?.find(({ id }) => id.toString() === studentId)

    if (student) {
      setSelectedStudent(student)
      setStudentSearch(`${student.user.fullName} (${student.id})`)
      return
    }

    setStudentSearch(studentId)
  }

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const studentOptions = students?.map((student) => (
    <Combobox.Option value={student.id.toString()} key={student.id} className="w-full basis-full">
      <div className="flex flex-col">
        <Text>{student.user.fullName}</Text>
        <Text c={"dimmed"}>{student.id}</Text>
      </div>
    </Combobox.Option>
  ))

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <div>
      <div className="mb-4">
        <Title order={4}>Select Existing Student</Title>
        <Text c="dimmed">Find and select an existing student to proceed with registration.</Text>
      </div>

      <Grid>
        <Grid.Col span={4}>
          <Combobox
            onOptionSubmit={(optionValue) => {
              handleOnSelectStudent(optionValue)
              combobox.closeDropdown()
            }}
            store={combobox}
            classNames={{
              dropdown: "!p-0",
            }}
            disabled={disabled}
          >
            <Combobox.Target>
              <TextInput
                prefix={"TEST"}
                placeholder="Search or Select a Student"
                value={studentSearch}
                onChange={(event) => {
                  setStudentSearch(event.currentTarget.value)
                  combobox.openDropdown()
                }}
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                disabled={disabled}
              />
            </Combobox.Target>

            {!selectedStudent && (
              <Combobox.Dropdown>
                <div className="max-h-[420px] overflow-y-auto">
                  <Combobox.Options>
                    <div className="flex min-h-[80px] flex-col items-center justify-center">
                      {isStudentLoading ? (
                        <LoadingOverlay visible loaderProps={{ size: "sm" }} />
                      ) : studentOptions?.length === 0 ? (
                        <Combobox.Empty>Nothing found</Combobox.Empty>
                      ) : (
                        studentOptions
                      )}
                    </div>
                  </Combobox.Options>
                </div>
              </Combobox.Dropdown>
            )}
          </Combobox>
        </Grid.Col>
      </Grid>
    </div>
  )
}
