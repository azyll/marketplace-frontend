import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { ComboboxItem, Grid, OptionsFilter, Select, Text, TextInput, Title } from "@mantine/core"
import { IStudentSex } from "@/types/student.type"
import { useOrderForm } from "@/pages/dashboard/orders/form/index"

interface Props {
  disabled?: boolean
}

export const OrderStudentCreateForm = ({ disabled }: Props) => {
  const { orderStudentCreateForm: form } = useOrderForm()

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

  return (
    <div>
      <div className="mb-4">
        <Title order={4}>Create new Student</Title>
        <Text size="sm" c={"dimmed"}>
          Create a new student to proceed with Order Create
        </Text>
      </div>

      <form>
        <Grid>
          <Grid.Col span={12}>
            {/* Student ID */}
            <TextInput
              label="Student ID"
              {...form.getInputProps("studentNumber")}
              disabled={disabled}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            {/*  First Name */}
            <TextInput
              label="First Name"
              {...form.getInputProps("firstName")}
              disabled={disabled}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            {/*  Last Name */}
            <TextInput label="Last Name" {...form.getInputProps("lastName")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={6}>
            {/* Student Program */}
            <Select
              label="Program"
              data={programOptions}
              filter={programOptionsFilter}
              nothingFoundMessage="Program Not Found."
              searchable
              disabled={disabled || isProgramsLoading}
              {...form.getInputProps("program")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            {/* Student Sex */}
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
