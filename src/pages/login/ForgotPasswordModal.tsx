import {
  Button,
  Modal,
  ModalProps,
  Select,
  Stack,
  Text,
  TextInput,
  Group,
  Loader,
  Notification,
  OptionsFilter,
  ComboboxItem,
} from "@mantine/core"
import { IconUser } from "@tabler/icons-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getPrograms } from "@/services/program.service"

import { KEY } from "@/constants/key"
import { useState } from "react"
import { IForgotPasswordUserInput } from "@/types/user.type"
import { forgotUserPassword } from "@/services/user.service"
import { notifications } from "@mantine/notifications"

interface Props extends Omit<ModalProps, "onSubmit"> {}

export const ForgotPasswordModal = ({ ...modalProps }: Props) => {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [username, setUsername] = useState<string>("")

  const {
    mutate,
    isPending: isSubmitting,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: IForgotPasswordUserInput) => {
      await forgotUserPassword(data)
    },
    onSuccess: () => {
      notifications.show({
        title: "Forgot Password Success",
        message: "Your new password is your registered username",
        color: "green",
      })
      modalProps.onClose()
    },
    onError: (err: any) => {
      notifications.show({
        title: "Failed to forgot your password",
        message: err.response?.data.error ?? "Please fill all fields",
        color: "red",
      })
    },
  })

  // Validate fields
  const isValid = firstName && lastName && username

  const handleSubmit = () => {
    if (isValid) {
      mutate({
        firstName,
        lastName,

        username: username,
      })
    } else {
      notifications.show({
        title: "Error",
        message: "Please fill all fields",
        color: "red",
      })
    }
  }

  return (
    <Modal
      {...modalProps}
      onClose={() => {
        setFirstName("")
        setLastName("")
        setUsername("")
        modalProps.onClose()
      }}
      withCloseButton={false}
      centered
      padding={24}
      closeOnClickOutside={true}
      size="lg"
    >
      <Stack>
        {/* Modal Instructions */}
        <Text size="sm">Reset your password here</Text>

        {/* First Name Input */}
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
          required
          leftSection={<IconUser size={18} />}
          description="Your registered first name"
        />

        {/* Last Name Input */}
        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
          required
          leftSection={<IconUser size={18} />}
          description="Your registered last name"
        />

        <TextInput
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
          leftSection={<IconUser size={18} />}
          description="Your registered username."
        />

        {/* Submit Button */}
        <Group mt="md">
          <Button
            onClick={handleSubmit}
            variant="filled"
            color="blue"
            fullWidth
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? <Loader size="sm" /> : "Submit"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
