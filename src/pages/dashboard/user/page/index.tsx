import { useNavigate, useParams } from "react-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, Card, ComboboxItem, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { ROUTES } from "@/constants/routes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { createUser, getUserById, updateUser } from "@/services/user.service"
import { ICreateUserInput, IUpdateUserInput } from "@/types/user.type"
import {
  ICreateStudentInput,
  IStudentLevel,
  IStudentSex,
  IUpdateStudentInput,
} from "@/types/student.type"
import { createStudent } from "@/services/student.service"
import { notifications } from "@mantine/notifications"
import Axios from "axios"
import { UserDetailsForm, UserDetailsFormRef } from "@/pages/dashboard/user/page/UserDetailsForm"
import {
  StudentDetailsForm,
  StudentDetailsFormRef,
} from "@/pages/dashboard/user/page/StudentDetailsForm"

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => userId === "create", [userId])
  const isUpdate = useMemo(() => !!userId && userId !== "create", [userId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.USER.BASE)
  }

  const { data: user, isLoading } = useQuery({
    queryKey: [KEY.USER, userId],
    queryFn: () => getUserById(userId ?? ""),
    enabled: isUpdate,
  })

  const userFormRef = useRef<UserDetailsFormRef>(null)
  const studentFormRef = useRef<StudentDetailsFormRef>(null)

  const [isStudent, setIsStudent] = useState<boolean>(false)

  const handleOnRoleChange = (roleOption: ComboboxItem) => {
    setIsStudent(roleOption.label === "Student")
  }

  useEffect(() => {
    // Initialize default form values
    if (user) {
      userFormRef.current?.form.setInitialValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        roleId: user.role.id,
      })

      userFormRef.current?.form.reset()

      if (user.student) {
        setIsStudent(true)

        studentFormRef.current?.form.setInitialValues({
          programId: user.student.program.id,
          level: user.student.level as IStudentLevel,
          id: user.student.id,
          sex: user.student.sex as IStudentSex,
        })

        studentFormRef.current?.form.reset()
      }
    }
  }, [user])

  const createUserMutation = useMutation({
    mutationFn: (payload: ICreateUserInput) => createUser(payload),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: { payload: IUpdateUserInput; userId: string }) =>
      updateUser(data.userId, data.payload),
  })

  const createStudentMutation = useMutation({
    mutationFn: (data: { payload: ICreateStudentInput; userId: string }) =>
      createStudent(data.userId, data.payload),
  })

  // NOTE: Comment muna dahil wala pang support for Student Update
  // const updateStudentMutation = useMutation({
  //   mutationFn: (data: { payload: IUpdateStudentInput; studentId: string }) =>
  //     updateStudent(data.studentId, data.payload),
  // })

  const handleOnCreateUser = async (
    payload: ICreateUserInput,
    studentPayload?: ICreateStudentInput,
  ) => {
    // Create User
    const userResponse = await createUserMutation.mutateAsync(payload)

    if (studentPayload && userResponse) {
      await createStudentMutation.mutateAsync({
        payload: studentPayload,
        userId: userResponse.id,
      })
    }

    notifications.show({
      title: "Create Success",
      message: "Successfully Created User",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.USERS] })
    navigate(ROUTES.DASHBOARD.USER.BASE)
  }

  const handleOnUpdateUser = async (
    payload: IUpdateUserInput,
    studentPayload?: IUpdateStudentInput,
  ) => {
    if (!user) return

    // Create User
    const userResponse = await updateUserMutation.mutateAsync({ payload, userId: user.id })

    // NOTE: Comment muna dahil wala pang support for Student Update
    // if (studentPayload && userResponse) {
    //   await updateStudentMutation.mutateAsync({
    //     payload: studentPayload,
    //     studentId: user.student.id,
    //   })
    // }

    notifications.show({
      title: "Update Success",
      message: "Successfully Updated User",
      color: "green",
    })

    await queryClient.invalidateQueries({ queryKey: [KEY.USERS] })
    await queryClient.invalidateQueries({ queryKey: [KEY.USER, user.id] })
    navigate(ROUTES.DASHBOARD.USER.BASE)
  }

  const handleOnSubmit = async () => {
    if (!userFormRef.current || !studentFormRef.current) return

    const { hasErrors } = userFormRef.current.form.validate()
    const { hasErrors: studentFormHasErrors } = studentFormRef.current.form.validate()

    if (hasErrors) return
    if (isStudent && studentFormHasErrors) return

    const userData = userFormRef.current?.form.getValues()
    const studentData = studentFormRef.current?.form.getValues()

    if (isUpdate) {
      try {
        await handleOnUpdateUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
        })
      } catch (error) {
        let errorMessage = "Unable to Update User, Please contact your Admin"

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
      await handleOnCreateUser(
        userData as ICreateUserInput,
        isStudent ? (studentData as ICreateStudentInput) : undefined,
      )
    } catch (error) {
      let errorMessage = "Unable to Update User, Please contact your Admin"

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
    return (
      createUserMutation.isPending ||
      updateUserMutation.isPending ||
      createStudentMutation.isPending
    )
  }, [createUserMutation.isPending, updateUserMutation.isPending, createStudentMutation.isPending])

  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>{isCreate ? "Create" : "Edit"} User</Title>

            <Text c="dimmed">
              {isCreate
                ? "Register a new user with the required details."
                : "Modify existing user information."}
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

          <UserDetailsForm ref={userFormRef} user={user} onRoleChange={handleOnRoleChange} />

          {isStudent && <Space h={38} />}

          <StudentDetailsForm
            ref={studentFormRef}
            user={user}
            disabled={isUpdate}
            show={isStudent}
          />
        </Box>
      </Card.Section>
    </Card>
  )
}
