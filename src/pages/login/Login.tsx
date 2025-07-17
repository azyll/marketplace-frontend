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

export default function Login() {
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
            Login to your account
          </Title>

          <Text
            mb="sm"
            c="dimmed"
          >
            Enter your Microsoft 365 account
          </Text>

          <Stack>
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
