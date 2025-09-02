import { AuthContext } from "@/contexts/AuthContext";
import {
  Stepper,
  Paper,
  Grid,
  Stack,
  Text,
  Title,
  Button,
  Divider,
} from "@mantine/core";
import { useContext } from "react";

export default function Order() {
  const user = useContext(AuthContext);

  return (
    <main className="max-w-[1200px] mx-auto py-8 px-4">
      <Grid
        gutter="xl"
        justify="center"
      >
        {/* LEFT SIDE - ORDER STATUS */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper
            shadow="sm"
            radius="md"
            p="lg"
            withBorder
          >
            <Stack
              align="center"
              gap="md"
            >
              <Title
                order={3}
                c="blue"
              >
                Order Placed
              </Title>
              <Text
                c="dimmed"
                size="sm"
                ta="center"
              >
                Make a copy of this receipt for your reference. <br />
                Your order will be cancelled if you do not pay it within 24
                hours.
              </Text>

              <Stepper
                active={1}
                allowNextStepsSelect={false}
                size="sm"
                color="blue"
                orientation="horizontal"
                className="w-full max-w-2xl"
                classNames={{
                  stepLabel: "text-xs font-semibold mt-2 text-center",
                  stepBody: "flex flex-col items-center",
                  stepIcon: "w-8 h-8 text-sm font-bold",
                  separator: "mx-2",
                }}
              >
                <Stepper.Step
                  label="ORDER PLACED"
                  description={
                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                    >
                      Successful
                    </Text>
                  }
                />
                <Stepper.Step
                  label="CONFIRM ORDER"
                  description={
                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                      className="leading-snug max-w-[160px]"
                    >
                      Show order number & complete slip at Proware
                    </Text>
                  }
                />
                <Stepper.Step
                  label="PAYMENT"
                  description={
                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                      className="leading-snug max-w-[160px]"
                    >
                      Show receipt & <br />
                      pay at the Cashier
                    </Text>
                  }
                />
                <Stepper.Step
                  label="CLAIM ORDER"
                  description={
                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                      className="leading-snug max-w-[160px]"
                    >
                      Show receipt & <br />
                      claim at Proware
                    </Text>
                  }
                />
              </Stepper>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            shadow="sm"
            radius="md"
            p="lg"
            withBorder
          >
            <Stack gap="md">
              <Stack gap={4}>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  ORDER DETAIL
                </Text>
                <Text
                  fw={500}
                  size="sm"
                >
                  #4fc08232-a809-4e62-8d4f-e3464f1cb901
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  size="xs"
                  mt="xs"
                >
                  Download Receipt
                </Button>
              </Stack>

              <Divider />

              <Stack gap={4}>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  Student Information
                </Text>
                <Text size="sm">{user.user?.student.id}</Text>
                <Text
                  size="sm"
                  fw={500}
                >
                  {user.user?.fullName}
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  {user.user?.student.program.name}
                </Text>
              </Stack>

              <Divider />

              <Stack gap={4}>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  ORDER SUMMARY
                </Text>
                <Text
                  fw={600}
                  size="lg"
                >
                  Total:
                </Text>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </main>
  );
}
