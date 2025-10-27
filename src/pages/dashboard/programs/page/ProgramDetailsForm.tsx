import { useForm, UseFormReturnType } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { Ref, useImperativeHandle, useMemo } from "react"
import { Grid, Select, TextInput, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { ICreateProgramInput, IProgram } from "@/types/program.type"
import { getDepartments } from "@/services/department.service"
import { createProgramSchema, updateProgramSchema } from "@/schema/program.schema"

export interface ProgramDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateProgramInput>>
}

interface Props {
  ref: Ref<ProgramDetailsFormRef>
  disabled?: boolean
  program?: IProgram
  initialValues?: Partial<IProgram>
}

export const ProgramDetailsForm = ({ ref, disabled, program: program, initialValues }: Props) => {
  const isUpdate = useMemo(() => !!program, [program])

  const form = useForm<Partial<ICreateProgramInput>>({
    initialValues: {
      name: initialValues?.name ?? undefined,
      acronym: initialValues?.acronym ?? undefined,
      departmentId: initialValues?.departmentId ?? undefined,
    },
    validate: zod4Resolver(isUpdate ? updateProgramSchema : createProgramSchema),
  })

  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getDepartments({ all: false, page: 1, limit: 100 }),
    select: (response) => response?.data?.map(({ name, id }) => ({ label: name, value: id })),
  })

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <div>
      <Title order={4} mb={12}>
        Program Details
      </Title>

      <form>
        <Grid>
          <Grid.Col span={4}>
            {/*  Name */}
            <TextInput label="Name" {...form.getInputProps("name")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/*  Acronym */}
            <TextInput label="Acronym" {...form.getInputProps("acronym")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/* Department */}
            <Select
              label="Department"
              data={departmentOptions}
              disabled={disabled || isDepartmentLoading}
              {...form.getInputProps("departmentId")}
            />
          </Grid.Col>
        </Grid>
      </form>
    </div>
  )
}
