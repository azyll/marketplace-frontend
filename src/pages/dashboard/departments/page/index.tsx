import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useNavigate, useParams } from "react-router"

import { notifications } from "@mantine/notifications"
import Axios from "axios"
import { Box, Button, Card, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { DepartmentDetailsForm, DepartmentDetailsFormRef } from "./DepartmentDetailsForm"
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "@/services/department.service"
import { ICreateDepartmentInput } from "@/types/department.type"

export const DepartmentPage = () => {
  const { departmentId } = useParams<{ departmentId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => departmentId === "create", [departmentId])
  const isUpdate = useMemo(() => !!departmentId && departmentId !== "create", [departmentId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.BASE)
  }

  const { data: department, isLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS, departmentId],
    queryFn: () => getDepartmentById(departmentId ?? ""),
    enabled: isUpdate,
  })
  const departmentFormRef = useRef<DepartmentDetailsFormRef>(null)
  useEffect(() => {
    // Initialize default form values
    if (department) {
      departmentFormRef.current?.form.setInitialValues({
        name: department.name,
        acronym: department.acronym,
      })

      departmentFormRef.current?.form.reset()
    }
  }, [department])

  const createDepartmentMutation = useMutation({
    mutationFn: (payload: ICreateDepartmentInput) => createDepartment(payload),
  })

  const updateDepartmentMutation = useMutation({
    mutationFn: (data: { payload: ICreateDepartmentInput; departmentId: string }) =>
      updateDepartment(data.departmentId, data.payload),
  })

  const handleOnCreateDepartment = async (payload: ICreateDepartmentInput) => {
    // Create department
    await createDepartmentMutation.mutateAsync(payload)

    notifications.show({
      title: "Create Success",
      message: "Successfully Created Department",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS] })
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.BASE)
  }
  const handleOnUpdateDepartment = async (payload: ICreateDepartmentInput) => {
    if (!department) return

    await updateDepartmentMutation.mutateAsync({ payload, departmentId: department.id })

    notifications.show({
      title: "Update Success",
      message: "Successfully Updated Department",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS] })
    await queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS, department.id] })
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.BASE)
  }

  const handleOnSubmit = async () => {
    if (!departmentFormRef.current || !departmentFormRef.current) return

    const { hasErrors } = departmentFormRef.current.form.validate()

    if (hasErrors) return

    const departmentData = departmentFormRef.current?.form.getValues()

    if (isUpdate) {
      try {
        await handleOnUpdateDepartment({
          name: String(departmentData.name?.trim()),
          acronym: String(departmentData.acronym?.trim()),
        })
      } catch (error) {
        let errorMessage = "Unable to Update Department, Please contact your Admin"

        if (Axios.isAxiosError(error)) {
          errorMessage = error.response?.data.error?.[0]?.message ?? errorMessage
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
      await handleOnCreateDepartment(departmentData as ICreateDepartmentInput)
    } catch (error) {
      let errorMessage = "Unable to Update Department, Please contact your Admin"

      if (Axios.isAxiosError(error)) {
        errorMessage = error.response?.data.error?.[0]?.message ?? errorMessage
      }

      notifications.show({
        title: "Create Failed",
        message: errorMessage,
        color: "red",
      })
    }
  }
  const isFormSubmitting = useMemo(() => {
    return createDepartmentMutation.isPending || updateDepartmentMutation.isPending
  }, [createDepartmentMutation.isPending, updateDepartmentMutation.isPending])
  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>{isCreate ? "Create" : "Edit"} Department</Title>

            <Text c="dimmed">
              {isCreate
                ? "Register a new department with the required details."
                : "Modify existing department information."}
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
          <DepartmentDetailsForm ref={departmentFormRef} department={department} />
        </Box>
      </Card.Section>
    </Card>
  )
}
