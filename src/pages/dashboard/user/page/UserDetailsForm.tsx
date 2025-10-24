import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateUserInput, IUser } from "@/types/user.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createUserSchema, updateUserSchema } from "@/schema/user.schema"
import { Ref, useImperativeHandle, useMemo } from "react"
import { ComboboxItem, Grid, Select, TextInput, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getRoles } from "@/services/role.service"

export interface UserDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateUserInput>>
}

interface Props {
  ref: Ref<UserDetailsFormRef>
  disabled?: boolean
  user?: IUser
  onRoleChange?: (roleOption: ComboboxItem) => void
  initialValues?: Partial<IUser>
}

export const UserDetailsForm = ({ ref, disabled, user, onRoleChange, initialValues }: Props) => {
  const isUpdate = useMemo(() => !!user, [user])

  const form = useForm<Partial<ICreateUserInput>>({
    initialValues: {
      firstName: initialValues?.firstName ?? undefined,
      lastName: initialValues?.lastName ?? undefined,
      username: initialValues?.username ?? undefined,
      password: initialValues?.firstName ?? undefined,
      roleId: initialValues?.firstName ?? undefined,
    },
    validate: zod4Resolver(isUpdate ? updateUserSchema : createUserSchema),
  })

  const { data: roleOptions, isLoading: isRolesLoading } = useQuery({
    queryKey: [KEY.ROLES],
    queryFn: () => getRoles({ page: 1, limit: 100 }),
    select: (response) => response?.data?.map(({ name, id }) => ({ label: name, value: id })),
  })

  form.watch("roleId", ({ value: roleId }) => {
    const role = roleOptions?.find((role) => role.value === roleId)

    if (!role) return

    onRoleChange?.(role)
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
        User Details
      </Title>

      <form>
        <Grid>
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
            {/* User Role */}
            <Select
              label="Role"
              data={roleOptions}
              disabled={disabled || isRolesLoading}
              {...form.getInputProps("roleId")}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            {/* Username */}
            <TextInput label="Username" disabled={disabled} {...form.getInputProps("username")} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/* Password */}
            <TextInput
              label="Password"
              disabled={isUpdate || disabled}
              {...form.getInputProps("password")}
            />
          </Grid.Col>
        </Grid>
      </form>
    </div>
  )
}
