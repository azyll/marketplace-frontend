import {
  Button,
  ComboboxItem,
  Flex,
  Group,
  Image,
  Modal,
  OptionsFilter,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { AuthContext } from "@/contexts/AuthContext"
import { useNavigate } from "react-router"
import { FormEvent, useContext, useState } from "react"
import { notifications } from "@mantine/notifications"
import { authenticateUser } from "@/services/auth.service"

import { useDisclosure } from "@mantine/hooks"
import { ForgotPasswordModal } from "./ForgotPasswordModal"

export default function Login() {
  const { fetchUser, user } = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [opened, { open, close }] = useDisclosure()

  const handleOnLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await authenticateUser({ username, password })

      localStorage.setItem("accessToken", response.data.accessToken)

      fetchUser()

      user?.roleSystemTag === "student" ? navigate("/") : navigate("/dashboard")
    } catch (error) {
      setIsLoading(false)

      notifications.show({
        title: "Login error",
        message: "Invalid username or password",
        color: "red",
      })
    }
  }
  const handleOnCloseModal = () => {
    close()
  }

  return (
    <main className="flex min-h-screen">
      <ForgotPasswordModal opened={opened} onClose={() => handleOnCloseModal()} />
      <div className="flex w-full items-center justify-center bg-[#0078D4] p-4 lg:w-1/2">
        <Paper className="w-full max-w-md" shadow="md" radius="md" p={50} withBorder>
          <Title order={2} ta="center" mb="xs">
            Sign in to your account
          </Title>

          <Text ta="center" c="dimmed" size="sm" mb="lg">
            Enter the account credentials from your Registration and Assessment Form (RAF).
          </Text>

          <form onSubmit={handleOnLoginSubmit}>
            <Stack gap="md">
              <TextInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="filled"
                label="Username"
                description="Enter only the part before @ (e.g., lastname.123456)"
                placeholder="Enter your username"
                disabled={isLoading}
              />

              <Stack gap="xs">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="filled"
                  label="Password"
                  description="Use the password format from your RAF"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <Button
                  onClick={open}
                  variant="subtle"
                  size="compact-xs"
                  p={0}
                  w="105"
                  justify="flex-start"
                >
                  Forgot Password?
                </Button>
              </Stack>

              <Button type="submit" loading={isLoading}>
                Sign In
              </Button>
            </Stack>
          </form>
        </Paper>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        {" "}
        1
        <Image
          className="absolute inset-0 h-full w-full object-cover brightness-80 grayscale-100"
          src="https://www.sti.edu/uploads/pr-2024-thumbnail-horizantal.webp"
          alt="STI Campus"
        />
      </div>
    </main>
  )
}
