import { Button, Image, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { AuthContext } from "@/contexts/AuthContext"
import { useNavigate } from "react-router"
import { FormEvent, useContext, useState } from "react"
import { notifications } from "@mantine/notifications"
import { authenticateUser } from "@/services/auth.service"

export default function Login() {
  const { fetchUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const handleOnLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await authenticateUser({ username, password })

      localStorage.setItem("accessToken", response.data.accessToken)

      fetchUser()

      navigate("/")
    } catch (error) {
      setIsLoading(false)

      notifications.show({
        title: "Login error",
        message: "Invalid username or password",
        color: "red",
      })
    }
  }

  return (
    <main className="flex min-h-screen">
      <div className="flex w-full items-center justify-center bg-[#0078D4] p-4 lg:w-1/2">
        <Paper className="w-full max-w-md" shadow="md" radius="md" p="xl" withBorder>
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
                radius="xl"
                label="Username"
                description="Enter only the part before @ (e.g., lastname.123456)"
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="filled"
                radius="xl"
                label="Password"
                description="Use the password format from your RAF"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />

              <Button radius="xl" type="submit" loading={isLoading} mt="md">
                Sign In
              </Button>
            </Stack>
          </form>
        </Paper>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          className="absolute inset-0 h-full w-full object-cover brightness-80 grayscale-100"
          src="https://www.sti.edu/uploads/pr-2024-thumbnail-horizantal.webp"
          alt="STI Campus"
        />
      </div>
    </main>
  )
}
