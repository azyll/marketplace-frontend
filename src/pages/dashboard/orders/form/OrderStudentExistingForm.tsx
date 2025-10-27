import { Combobox, Grid, LoadingOverlay, Text, TextInput, Title, useCombobox } from "@mantine/core"
import { useEffect, useState } from "react"
import { IStudent } from "@/types/student.type"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getAllStudents } from "@/services/student.service"
import { useDebouncedState } from "@mantine/hooks"
import { useOrderForm } from "@/pages/dashboard/orders/form/index"

interface Props {
  disabled?: boolean
}

export const OrderStudentExistingForm = ({ disabled }: Props) => {
  const { orderStudentForm: form } = useOrderForm()

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

    if (!!student) {
      setSelectedStudent(student)
      form.setValues({
        studentNumber: student.id.toString(),
        sex: student.sex as IStudent["sex"],
        program: student.programId,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
      })
      setStudentSearch(`${student.user.fullName} (${student.id})`)

      return
    }

    setStudentSearch(studentId)
  }

  useEffect(() => {
    const student = form.getValues()
    const fullName = student.firstName + " " + student.lastName

    if (student.firstName) {
      setStudentSearch(`${fullName} (${student.studentNumber})`)
    }
  }, [])

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

  return (
    <div>
      <div className="mb-4">
        <Title order={4}>Select Existing Student</Title>
        <Text size="sm" c={"dimmed"}>
          Search and Select an Existing Student to proceed with Order Create
        </Text>
      </div>

      <Grid>
        <Grid.Col span={12}>
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
