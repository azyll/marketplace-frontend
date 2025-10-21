import { useForm, UseFormReturnType } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { Ref, useImperativeHandle, useMemo } from "react"
import { Grid, TextInput, Title } from "@mantine/core"

import { ICreateDepartmentInput, IDepartment } from "@/types/department.type"
import { createDepartmentSchema, updateDepartmentSchema } from "@/schema/department.schema"

export interface DepartmentDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateDepartmentInput>>
}

interface Props {
  ref: Ref<DepartmentDetailsFormRef>
  disabled?: boolean
  department?: IDepartment
  initialValues?: Partial<IDepartment>
}

export const DepartmentDetailsForm = ({ ref, disabled, department, initialValues }: Props) => {
  const isUpdate = useMemo(() => !!department, [department])

  const form = useForm<Partial<ICreateDepartmentInput>>({
    initialValues: {
      name: initialValues?.name ?? undefined,
      acronym: initialValues?.acronym ?? undefined,
    },
    validate: zod4Resolver(isUpdate ? updateDepartmentSchema : createDepartmentSchema),
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
        Department Details
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
        </Grid>
      </form>
    </div>
  )
}
