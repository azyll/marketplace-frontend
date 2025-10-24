import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { createRole, getRoleById, updateRole } from "@/services/role.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { RoleDetailsForm, RoleDetailsFormRef } from "./RoleDetailsForm"
import { ICreateRoleInput, IRoleSystemTag, IUpdateRoleInput } from "@/types/role.type"
import { notifications } from "@mantine/notifications"
import Axios from "axios"
import { Box, Button, Card, LoadingOverlay, Space, Text, Title } from "@mantine/core"

export const RolePage = () => {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isCreate = useMemo(() => roleId === "create", [roleId])
  const isUpdate = useMemo(() => !!roleId && roleId !== "create", [roleId])
  const [isEmployee, setIsEmployee] = useState<boolean>(false)
  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.ROLES.BASE)
  }

  const { data: role, isLoading } = useQuery({
    queryKey: [KEY.ROLES, roleId],
    queryFn: () => getRoleById(roleId ?? ""),
    enabled: isUpdate,
  })
  const roleFormRef = useRef<RoleDetailsFormRef>(null)
  useEffect(() => {
    // Initialize default form values
    if (role) {
      roleFormRef.current?.form.setInitialValues({
        name: role.name,
        systemTag: role.systemTag,
        modulePermission: role.modulePermission,
      })

      roleFormRef.current?.form.reset()

      setIsEmployee(role.systemTag === "employee")
    }
  }, [role])

  const createRoleMutation = useMutation({
    mutationFn: (payload: ICreateRoleInput) => createRole(payload),
  })

  const updateRoleMutation = useMutation({
    mutationFn: (data: { payload: IUpdateRoleInput; roleId: string }) =>
      updateRole(data.roleId, data.payload),
  })
  const handleOnCreateRole = async (payload: ICreateRoleInput) => {
    // Create department
    await createRoleMutation.mutateAsync(payload)

    notifications.show({
      title: "Create Success",
      message: "Successfully Created Role",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.ROLES] })
    navigate(ROUTES.DASHBOARD.ROLES.BASE)
  }
  const handleOnUpdateRole = async (payload: ICreateRoleInput) => {
    if (!role) return

    await updateRoleMutation.mutateAsync({ payload, roleId: role.id })

    notifications.show({
      title: "Update Success",
      message: "Successfully Updated Role",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.ROLES] })

    navigate(ROUTES.DASHBOARD.ROLES.BASE)
  }

  const handleOnSubmit = async () => {
    if (!roleFormRef.current || !roleFormRef.current) return

    const { hasErrors } = roleFormRef.current.form.validate()

    if (hasErrors) {
      return
    }

    const roleData = roleFormRef.current?.form.getValues()

    if (isUpdate) {
      try {
        await handleOnUpdateRole({
          name: String(roleData.name?.trim()),
          systemTag: String(roleData.systemTag?.trim()) as IRoleSystemTag,
          modulePermission:
            roleData.systemTag === "employee" ? (roleData.modulePermission ?? []) : [],
        })
      } catch (error) {
        let errorMessage = "Unable to Update Role, Please contact your Admin"

        if (Axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data.error?.[0]?.message ?? error.response?.data.error ?? errorMessage
        }

        notifications.show({
          title: "Update Failed",
          message: errorMessage,
          color: "red",
        })
      }
      return
    }

    try {
      await handleOnCreateRole(roleData as ICreateRoleInput)
    } catch (error) {
      let errorMessage = "Unable to Update Role, Please contact your Admin"

      if (Axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data.error?.[0]?.message ?? error.response?.data.error ?? errorMessage
      }

      notifications.show({
        title: "Create Failed",
        message: errorMessage,
        color: "red",
      })
    }
  }
  const isFormSubmitting = useMemo(() => {
    return createRoleMutation.isPending || updateRoleMutation.isPending
  }, [createRoleMutation.isPending, updateRoleMutation.isPending])
  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>{isCreate ? "Create" : "Edit"} Role</Title>

            <Text c="dimmed">
              {isCreate
                ? "Register a new role with the required details."
                : "Modify existing role information."}
            </Text>
          </div>

          <div className="flex gap-2">
            <Button variant="light" onClick={() => handleOnCancel()} disabled={isFormSubmitting}>
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={() => handleOnSubmit()}
              loading={isFormSubmitting}
            >
              Save
            </Button>
          </div>
        </div>
      </Card.Section>

      <Space h={16} />

      <Card.Section px={24} pb={24}>
        <Box pos="relative" mih={220}>
          <LoadingOverlay
            visible={isFormSubmitting || isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm" }}
            mih={220}
          />
          <RoleDetailsForm ref={roleFormRef} role={role} isEmployee={isEmployee} />
        </Box>
      </Card.Section>
    </Card>
  )
}
