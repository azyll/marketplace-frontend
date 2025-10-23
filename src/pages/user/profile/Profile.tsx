import { EditableWrapper } from "@/components/EditableWrapper"
import { AuthContext } from "@/contexts/AuthContext"
import { Button, Group, Modal, PasswordInput, Space, Stack, Text, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useContext, useEffect, useState } from "react"
import { useForm } from "@mantine/form"
import { useMutation } from "@tanstack/react-query"
import { updatePassword } from "@/services/user.service"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"

export default function Profile() {
  const user = useContext(AuthContext)

  const [modalOpened, setModalOpened] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      password: user.user?.username,
    },
  })

  useEffect(() => {
    form.setInitialValues({
      password: user.user?.username,
    })
    form.reset()
  }, [user])

  // 🔹 Mutation for updating password
  const passwordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => {
      if (!user.user?.id) {
        throw new Error("User ID is not available")
      }

      return updatePassword(user.user.id, data)
    },
    onSuccess: () => {
      notifications.show({
        title: "Password Updated",
        message: "Your password has been successfully changed.",
        color: "green",
      })

      // Reset form and close modal
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setModalOpened(false)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }> | Error) => {
      if (error instanceof AxiosError) {
        notifyResponseError(error, "User Password", "update")
      }
    },
  })

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notifications.show({
        title: "Missing Fields",
        message: "Please fill in all password fields.",
        color: "red",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      notifications.show({
        title: "Password Mismatch",
        message: "New password and confirmation do not match.",
        color: "red",
      })
      return
    }

    if (newPassword === currentPassword) {
      notifications.show({
        title: "Invalid Password",
        message: "New password cannot be the same as your current password.",
        color: "red",
      })
      return
    }

    if (newPassword.length < 8) {
      notifications.show({
        title: "Password Too Short",
        message: "New password must be at least 8 characters long.",
        color: "red",
      })
      return
    }

    passwordMutation.mutate({
      oldPassword: currentPassword,
      newPassword: newPassword,
    })
  }

  const handleModalClose = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setModalOpened(false)
  }

  return (
    <div className="max-w-page-width page-x-padding mx-auto mt-4">
      <div>
        <Title size="h3">User Details</Title>

        <Space h={12} />

        <div className="space-y-3">
          <Text size="sm" fw={500} c="dimmed">
            Full Name
          </Text>
          <Text>{user.user?.fullName || "Not provided"}</Text>
        </div>

        <Space h={12} />

        <Group justify="space-between">
          <div className="space-y-3">
            <Text size="sm" fw={500} c="dimmed">
              Password
            </Text>
            <Text>{"••••••••"}</Text>
          </div>
          <Button variant="light" size="xs" onClick={() => setModalOpened(true)}>
            Change Password
          </Button>
        </Group>

        <Modal
          opened={modalOpened}
          onClose={handleModalClose}
          title="Change Password"
          centered
          size="sm"
        >
          <Stack gap="md">
            <PasswordInput
              disabled={passwordMutation.isPending}
              label="Current Password"
              placeholder="Enter your current password"
              radius="xl"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              disabled={passwordMutation.isPending}
              label="New Password"
              placeholder="Enter your new password"
              radius="xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <PasswordInput
              disabled={passwordMutation.isPending}
              label="Confirm New Password"
              placeholder="Confirm your new password"
              radius="xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} loading={passwordMutation.isPending}>
                Change Password
              </Button>
            </Group>
          </Stack>
        </Modal>
      </div>

      <Space h={24} />

      {user.user?.student ? (
        <div>
          <Title size="h3">Student Details</Title>

          <Space h={12} />

          <div className="space-y-3">
            <div>
              <Text size="sm" fw={500} c="dimmed">
                Student ID
              </Text>
              <Text>0{user.user.student.id || "Not provided"}</Text>
            </div>

            <div>
              <Text size="sm" fw={500} c="dimmed">
                Program
              </Text>
              <Text>{user.user.student.program?.name || "Not assigned"}</Text>
            </div>

            <div>
              <Text size="sm" fw={500} c="dimmed">
                Sex
              </Text>
              <Text tt="capitalize">{user.user.student.sex || "Not assigned"}</Text>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
