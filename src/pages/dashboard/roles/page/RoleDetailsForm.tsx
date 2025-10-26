import { createRoleSchema, updateRoleSchema } from "@/schema/role.schema"
import { ICreateRoleInput, IRole, IRoleAccessModule, Module } from "@/types/role.type"
import { Checkbox, Grid, Group, Radio, Select, Text, TextInput, Title } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { Ref, useImperativeHandle, useMemo } from "react"

const RoleOptions = [
  {
    value: "student",
    label: "Student",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "employee",
    label: "Employee",
  },
]
export interface RoleDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateRoleInput>>
}
interface Props {
  ref: Ref<RoleDetailsFormRef>
  disabled?: boolean
  role?: IRole
  isEmployee: boolean
  initialValues?: Partial<IRole>
}

const modulesOption = [
  { value: "products", name: "Products" },
  { value: "sales", name: "Sales" },
  { value: "orders", name: "Orders" },
  { value: "inventory", name: "Inventory" },
  { value: "return-items", name: "Return Items" },
]

const permissionOptions = ["edit", "view"]
export const RoleDetailsForm = ({ ref, isEmployee, disabled, role, initialValues }: Props) => {
  const isUpdate = useMemo(() => !!role, [role])

  const form = useForm<Partial<ICreateRoleInput>>({
    initialValues: {
      name: initialValues?.name ?? undefined,
      systemTag: initialValues?.systemTag,
      modulePermission:
        isEmployee &&
        (!initialValues?.modulePermission || initialValues?.modulePermission.length === 0)
          ? ([{ module: "users", permission: "view" }] as IRoleAccessModule[]) // Type assertion here
          : (initialValues?.modulePermission ?? []),
    },
    validate: zod4Resolver(isUpdate ? updateRoleSchema : createRoleSchema),
  })
  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )
  console.log(form.errors)

  const handleModuleChange = (module: string, checked: boolean) => {
    form.setFieldValue("modulePermission", (prevPermissions) => {
      let newPermissions = [...(prevPermissions ?? [])]

      // Always ensure "users" module is included with "view" permission
      const usersPermission = newPermissions.find((perm) => perm.module === "users")
      if (!usersPermission) {
        // @ts-ignore
        newPermissions.push({ module: "users", permission: "view" })
      }

      // Now handle the other modules
      if (module !== "users") {
        if (checked) {
          newPermissions.push({ module: module as Module, permission: "view" }) // Default to 'view' permission
        } else {
          newPermissions = newPermissions.filter((permission) => permission.module !== module)
        }
      }

      return newPermissions
    })
  }

  // Handle permission change for each module
  const handlePermissionChange = (module: string, permission: string) => {
    // @ts-ignore
    form.setFieldValue("modulePermission", (prevPermissions) => {
      const newPermissions =
        prevPermissions?.map((perm) => {
          if (perm.module === module) {
            return { ...perm, permission }
          }
          return perm
        }) ?? []
      return newPermissions
    })
  }

  return (
    <div>
      <Title order={4} mb={12}>
        Role Details
      </Title>

      <form>
        <Grid>
          <Grid.Col span={4}>
            {/*  Name */}
            <TextInput label="Name" {...form.getInputProps("name")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={4}>
            {/*  Acronym */}
            <Select
              label="System Tag"
              data={RoleOptions}
              disabled={disabled}
              {...form.getInputProps("systemTag")}
            />
          </Grid.Col>
        </Grid>

        {form.values.systemTag === "employee" && (
          <Grid mt={12}>
            <Grid.Col span={12}>
              <Title order={5}>Assign Modules and Permissions</Title>
              <Text c="dimmed">
                Select which modules this role can access and set the corresponding permissions
              </Text>
            </Grid.Col>

            {/* Module Selection and Permission Assignment */}
            <Grid.Col span={12}>
              <Group>
                {modulesOption.map((module) => {
                  const modulePermission = form.values.modulePermission?.find(
                    (perm) => perm.module === module.value,
                  )

                  return (
                    <div key={module.value} style={{ width: "100%" }}>
                      <Checkbox
                        {...form.getInputProps("modulePermission")}
                        label={module.name}
                        checked={!!modulePermission}
                        onChange={(e) => handleModuleChange(module.value, e.currentTarget.checked)}
                        disabled={disabled}
                      />
                      {modulePermission && (
                        <Radio.Group
                          ml={32}
                          // label="Permission"
                          value={modulePermission.permission}
                          onChange={(value) =>
                            handlePermissionChange(module.value, value as "view" | "edit")
                          }
                        >
                          <Group>
                            {permissionOptions.map((permission) => (
                              <Radio
                                key={permission}
                                value={permission}
                                label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                              />
                            ))}
                          </Group>
                        </Radio.Group>
                      )}
                    </div>
                  )
                })}
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </form>
    </div>
  )
}
