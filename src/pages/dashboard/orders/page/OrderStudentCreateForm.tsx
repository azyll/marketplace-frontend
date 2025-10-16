import { Form } from "react-router"
import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateOrderStudentCreateInput, ICreateOrderStudentInput } from "@/types/order.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createOrderStudentCreateSchema, createOrderStudentSchema } from "@/schema/order.schema"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { ComboboxItem, Grid, OptionsFilter, Select, Text, TextInput, Title } from "@mantine/core"
import { IStudentSex } from "@/types/student.type"
import { Ref, useImperativeHandle } from "react"
import { OrderStudentFormRef } from "@/pages/dashboard/orders/page/OrderStudentForm"

export interface OrderStudentCreateFormRef {
  form: UseFormReturnType<Partial<ICreateOrderStudentCreateInput>>
}

interface Props {
  ref: Ref<OrderStudentCreateFormRef>
  disabled?: boolean
}

export const OrderStudentCreateForm = ({ ref, disabled }: Props) => {
  const form = useForm<Partial<ICreateOrderStudentCreateInput>>({
    initialValues: {
      firstName: undefined,
      lastName: undefined,
      sex: undefined,
      program: undefined,
      studentNumber: undefined,
    },
    validate: zod4Resolver(createOrderStudentCreateSchema),
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

  return (
    <div>
      <div className="mb-4">
        <Title order={4}>Add New Student</Title>

        <Text c="dimmed">Register a new student with the required details.</Text>
      </div>

      <form>
        <Grid>
          <Grid.Col span={4}>
            {/* Student ID */}
            <TextInput label="Student ID" {...form.getInputProps("id")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/*  First Name */}
            <TextInput
              label="First Name"
              {...form.getInputProps("firstName")}
              disabled={disabled}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            {/*  Last Name */}
            <TextInput label="Last Name" {...form.getInputProps("lastName")} disabled={disabled} />
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

          <Grid.Col span={4}>
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
