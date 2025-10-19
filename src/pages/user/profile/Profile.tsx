import { EditableWrapper } from "@/components/EditableWrapper"
import { AuthContext } from "@/contexts/AuthContext"
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useContext, useEffect, useState } from "react"

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

  const handlePasswordChange = () => {
    // Add your password change logic here
    console.log("Password change submitted")

    // Reset form and close modal
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setModalOpened(false)
  }

  const handleModalClose = () => {
    // Reset form when modal closes
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
              label="Current Password"
              placeholder="Enter your current password"
              radius="xl"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              radius="xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <PasswordInput
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
              <Button onClick={handlePasswordChange}>Change Password</Button>
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
      ) : (
        <></>
      )}
    </div>
  )
}
