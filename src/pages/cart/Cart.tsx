import { getImage } from "@/services/media.service";
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Nike Air Zoom",
      price: 1999,
      image: "https://via.placeholder.com/80",
      quantity: 1,
    },
  ]);

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter="xl"
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap="md">
            <Title order={4}>My Cart</Title>

            {cartItems &&
              cartItems.map((item) => (
                <Card
                  key={item.id}
                  withBorder
                  radius="md"
                  padding="md"
                >
                  <Group
                    justify="space-between"
                    align="flex-start"
                  >
                    <Group>
                      <Image
                        src={item.image}
                        alt={item.name}
                        radius="md"
                        w={80}
                        h={80}
                      />
                      <Stack gap={4}>
                        <Text fw={500}>{item.name}</Text>

                        <Text
                          size="sm"
                          c="dimmed"
                        >
                          ₱{item.price.toFixed(2)}
                        </Text>
                      </Stack>
                    </Group>

                    <ActionIcon
                      variant="subtle"
                      color="red"
                    >
                      <IconX
                        size={18}
                        stroke={3}
                      />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card
            withBorder
            radius="md"
            padding="lg"
          >
            <Title
              order={4}
              mb="md"
            >
              Order Summary
            </Title>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text>Subtotal</Text>
              </Group>

              <Divider />

              <Group justify="apart">
                <Text fw={700}>Total</Text>
              </Group>

              <Button
                fullWidth
                mt="md"
                size="md"
                radius="xl"
              >
                Checkout
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </main>
  );
}
