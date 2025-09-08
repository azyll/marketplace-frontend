import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateStudentInput, IStudentLevel, IStudentSex } from "@/types/student.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createStudentSchema } from "@/schema/student.schema"
import { Ref, useImperativeHandle, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { ComboboxItem, Grid, OptionsFilter, Select, TextInput, Title } from "@mantine/core"
import { IUser } from "@/types/user.type"

export interface StudentDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateStudentInput>>
}

interface Props {
  ref: Ref<StudentDetailsFormRef>
  disabled?: boolean
  user?: IUser
  show?: boolean
}

export const StudentDetailsForm = ({ ref, disabled, show }: Props) => {
  const form = useForm<Partial<ICreateStudentInput>>({
    initialValues: {
      programId: undefined,
      level: undefined,
      id: undefined,
      sex: undefined,
    },
    validate: zod4Resolver(createStudentSchema),
  })

  const { data: programOptions, isLoading: isProgramsLoading } = useQuery({
    queryKey: [KEY.PROGRAMS],
    queryFn: () => getPrograms({ page: 1, limit: 100 }),
    select: (response) => response?.data?.map(({ name, id }) => ({ label: name, value: id })),
  })

  const programOptionsFilter: OptionsFilter = ({ search }) => {
    if (!programOptions) return []

    const filtered = (programOptions as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
    )

    filtered.sort((a, b) => a.label.localeCompare(b.label))
    return filtered
  }

  const studentLevelOptions: { label: string; value: IStudentLevel }[] = [
    {
      label: "Tertiary/College",
      value: "tertiary",
    },
    {
      label: "Senior High School",
      value: "shs",
    },
  ]

  const studentSexOptions: { label: string; value: IStudentSex }[] = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
  ]

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  if (!show) return

  return (
    <div>
      <Title order={4} mb={12}>
        Student Details
      </Title>

      <form>
        <Grid>
          <Grid.Col span={4}>
            {/* Student ID */}
            <TextInput label="Student ID" {...form.getInputProps("id")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/* Student Program */}
            <Select
              label="Program"
              data={programOptions}
              filter={programOptionsFilter}
              nothingFoundMessage="Program Not Found."
              searchable
              disabled={disabled || isProgramsLoading}
              {...form.getInputProps("programId")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            {/* Student Level */}
            <Select
              label="Level"
              data={studentLevelOptions}
              disabled={disabled}
              {...form.getInputProps("level")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            {/* Student Level */}
            <Select
              label="Sex"
              data={studentSexOptions}
              disabled={disabled}
              {...form.getInputProps("sex")}
            />
          </Grid.Col>
        </Grid>
      </form>
    </div>
  )
}
