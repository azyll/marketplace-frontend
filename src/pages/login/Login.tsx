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
import { useNavigate } from "react-router";
import { useContext, useState } from "react";

export default function Login() {
  const { setUser, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnLoginSubmit = {};

  // const {} = useQuery({
  //   queryKey: "",
  //   queryFn: ()
  // })

  return (
    <section className="flex min-h-screen">
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
            <TextInput
              label="Email"
              labelProps={{ mb: "xs" }}
              placeholder="last_name@fairview.sti.edu"
            />

            <PasswordInput
              label="Password"
              labelProps={{ mb: "xs" }}
              placeholder="*********"
            />

            <Button>Sign In</Button>
          </Stack>
        </Paper>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          className="absolute inset-0 h-full w-full object-cover grayscale-100 brightness-80"
          src={"https://www.sti.edu/uploads/pr-2024-thumbnail-horizantal.webp"}
        ></Image>
      </div>
    </section>
  );
}
function async(event: Event | undefined) {
  throw new Error("Function not implemented.");
}
