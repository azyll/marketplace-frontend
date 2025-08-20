import { AuthContext } from "@/contexts/AuthContext";
import { CartContext } from "@/contexts/CartContext";
import { getImage } from "@/services/media.service";
import {
  ActionIcon,
  Button,
  Card,
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
import { useContext, useEffect, useState } from "react";

export default function Cart() {
  const { cart, getCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      getCart();
    }
  }, [user]);

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter="xl"
        mt={{ base: 0, sm: "md" }}
        px={{ sm: "xl", xl: 0 }}
      >
        {/* TODO: add loading for fetching and removing items from cart */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap="md">
            <Title order={4}>My Cart</Title>

            {cart &&
              cart.map((data) => (
                <Card
                  key={data.id}
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
                        src={getImage(data.productVariant.product.image)}
                        alt={data.productVariant.name}
                        radius="md"
                        w={80}
                        h={80}
                      />
                      <Stack gap={4}>
                        <Text fw={500}>{data.productVariant.product.name}</Text>{" "}
                        <Text
                          size="sm"
                          c="dimmed"
                        >
                          ₱{data.productVariant.price.toFixed(2)}
                        </Text>
                        <Text
                          size="xs"
                          c="dimmed"
                        >
                          {data.productVariant.productAttribute.name +
                            ": " +
                            data.productVariant.name}
                          <br />
                          Size: {data.productVariant.size}
                        </Text>
                      </Stack>
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => removeFromCart(data.productVariantId)}
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
            mt="42"
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
              {cart?.map((item) => (
                <Group
                  key={item.id}
                  justify="space-between"
                >
                  <Text>
                    {item.productVariant.product.name} x{item.quantity}
                  </Text>
                  <Text>
                    ₱{(item.productVariant.price * item.quantity).toFixed(2)}
                  </Text>
                </Group>
              ))}

              <Divider />

              {/* Total */}
              <Group justify="space-between">
                <Text fw={700}>Total</Text>
                <Text fw={700}>
                  ₱
                  {cart
                    ? cart
                        .reduce(
                          (sum, item) => sum + item.productVariant.price,
                          0
                        )
                        .toFixed(2)
                    : "0.00"}
                </Text>
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
