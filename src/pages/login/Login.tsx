import {
  AppShell,
  Button,
  Divider,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/AuthContext";
import { Form, useNavigate } from "react-router";
import { FormEvent, useContext, useState } from "react";
import axios from "../../utils/axios";
import { notifications } from "@mantine/notifications";
import { ILoginResponse } from "../../types/auth.type";

export default function Login() {
  const { setUser, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleOnLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login(email, password);
  };

  const login = async (userEmail: string, userPassword: string) => {
    try {
      setIsLoading(true);

      const response = await axios.post<ILoginResponse>("/auth/login", {
        email: userEmail,
        password: userPassword,
      });

      localStorage.setItem("accessToken", response.data.accessToken);

      navigate("/");
    } catch (error) {
      setIsLoading(false);

      notifications.show({
        title: "Login error",
        message: "Invalid email or password",
        color: "red",
      });
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0078D4] p-4">
        <Paper
          className="w-full max-w-md"
          shadow="md"
          radius="md"
          p={"xl"}
          withBorder
        >
          <Title
            order={2}
            ta="center"
            m="xs"
          >
            Sign in to your account
          </Title>

          <Text
            px="sm"
            mb="sm"
            ta="center"
            c="dimmed"
          >
            Enter your Microsoft 365 account
          </Text>

          <Stack px="sm">
            <form
              onSubmit={(e) => handleOnLoginSubmit(e)}
              className="flex flex-col gap-4"
            >
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                labelProps={{ mb: "xs" }}
                placeholder="last_name@fairview.sti.edu"
                disabled={isLoading}
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                labelProps={{ mb: "xs" }}
                placeholder="*********"
                disabled={isLoading}
              />

              <Button
                type="submit"
                loading={isLoading}
              >
                Sign In
              </Button>
            </form>
          </Stack>
        </Paper>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          className="absolute inset-0 h-full w-full object-cover grayscale-100 brightness-80"
          src={"https://www.sti.edu/uploads/pr-2024-thumbnail-horizantal.webp"}
        ></Image>
      </div>
    </main>
  );
}
function async(event: Event | undefined) {
  throw new Error("Function not implemented.");
}
