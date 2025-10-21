import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { createProgram, getProgramById, updateProgram } from "@/services/program.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import { ProgramDetailsForm, ProgramDetailsFormRef } from "./ProgramDetailsForm"
import { ICreateProgramInput } from "@/types/program.type"
import { notifications } from "@mantine/notifications"
import Axios from "axios"
import { Box, Button, Card, LoadingOverlay, Space, Text, Title } from "@mantine/core"

export const ProgramPage = () => {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => programId === "create", [programId])
  const isUpdate = useMemo(() => !!programId && programId !== "create", [programId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.PROGRAMS.BASE)
  }

  const { data: program, isLoading } = useQuery({
    queryKey: [KEY.PROGRAMS, programId],
    queryFn: () => getProgramById(programId ?? ""),
    enabled: isUpdate,
  })
  const programFormRef = useRef<ProgramDetailsFormRef>(null)
  useEffect(() => {
    // Initialize default form values
    if (program) {
      programFormRef.current?.form.setInitialValues({
        name: program.name,
        acronym: program.acronym,
        departmentId: program.departmentId,
      })

      programFormRef.current?.form.reset()
    }
  }, [program])

  const createProgramMutation = useMutation({
    mutationFn: (payload: ICreateProgramInput) => createProgram(payload),
  })

  const updateProgramMutation = useMutation({
    mutationFn: (data: { payload: ICreateProgramInput; programId: string }) =>
      updateProgram(data.programId, data.payload),
  })

  const handleOnCreateProgram = async (payload: ICreateProgramInput) => {
    // Create program
    await createProgramMutation.mutateAsync(payload)

    notifications.show({
      title: "Create Success",
      message: "Successfully Created Program",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.PROGRAMS] })
    navigate(ROUTES.DASHBOARD.PROGRAMS.BASE)
  }
  const handleOnUpdateProgram = async (payload: ICreateProgramInput) => {
    if (!program) return

    await updateProgramMutation.mutateAsync({ payload, programId: program.id })

    notifications.show({
      title: "Update Success",
      message: "Successfully Updated Program",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.PROGRAMS] })
    await queryClient.invalidateQueries({ queryKey: [KEY.PROGRAMS, program.id] })
    navigate(ROUTES.DASHBOARD.PROGRAMS.BASE)
  }

  const handleOnSubmit = async () => {
    if (!programFormRef.current || !programFormRef.current) return

    const { hasErrors } = programFormRef.current.form.validate()

    if (hasErrors) return

    const programData = programFormRef.current?.form.getValues()

    if (isUpdate) {
      try {
        await handleOnUpdateProgram({
          name: String(programData.name),
          acronym: String(programData.acronym),
          departmentId: String(programData.departmentId),
        })
      } catch (error) {
        let errorMessage = "Unable to Update Program, Please contact your Admin"

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
      await handleOnCreateProgram(programData as ICreateProgramInput)
    } catch (error) {
      let errorMessage = "Unable to Update Program, Please contact your Admin"

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
    return createProgramMutation.isPending || updateProgramMutation.isPending
  }, [createProgramMutation.isPending, updateProgramMutation.isPending])
  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>{isCreate ? "Create" : "Edit"} Program</Title>

            <Text c="dimmed">
              {isCreate
                ? "Register a new program with the required details."
                : "Modify existing program information."}
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
          <ProgramDetailsForm ref={programFormRef} program={program} />
        </Box>
      </Card.Section>
    </Card>
  )
}
