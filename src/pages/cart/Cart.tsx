import { AuthContext } from "@/contexts/AuthContext";
import { getImage } from "@/services/media.service";
import { getItems, removeItem } from "@/services/cart.service";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMoodSad, IconX } from "@tabler/icons-react";
import { useContext } from "react";
import CartItemSkeleton from "./components/CartItemSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "./components/ConfirmationModal";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getItems(user!.id),
    enabled: !!user?.id, // only run if user is logged in
  });

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (variantId: string) => removeItem(user!.id, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });

  const isRemoving = removeMutation.isPending;

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter="xl"
        mt={{ base: 0, sm: "md" }}
        px={{ sm: "xl", xl: 0 }}
      >
        {/* Cart items */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap="md">
            <Title order={4}>My Cart</Title>

            {isLoading && !user ? (
              // Skeletons while loading
              Array.from({ length: 2 }).map((_, i) => (
                <CartItemSkeleton key={i} />
              ))
            ) : cart && cart.length > 0 ? (
              cart.map((data: any) => (
                <Card
                  key={data.id}
                  withBorder
                  radius="md"
                  padding="md"
                  className={`relative transition-opacity ${
                    isRemoving ? "opacity-50 pointer-events-none" : ""
                  }`}
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
                        <Text fw={500}>{data.productVariant.product.name}</Text>
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
                      onClick={() => {
                        removeMutation.mutate(data.productVariantId);
                      }}
                      loading={isRemoving}
                    >
                      <IconX
                        size={18}
                        stroke={3}
                      />
                    </ActionIcon>
                  </Group>
                </Card>
              ))
            ) : cart && cart.length === 0 ? (
              <div className="flex justify-center items-center flex-col h-full">
                <IconMoodSad
                  color="gray"
                  size={32}
                  stroke={1.5}
                />
                <Text
                  ta="center"
                  c="dimmed"
                >
                  No items in cart.
                </Text>
              </div>
            ) : null}
          </Stack>
        </Grid.Col>

        {/* Order summary */}
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
              {cart?.map((item: any) => (
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

              <Group justify="space-between">
                <Text fw={700}>Total</Text>
                <Text fw={700}>
                  ₱
                  {cart
                    ? cart
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.productVariant.price * item.quantity,
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
                onClick={open}
              >
                Place Order
              </Button>

              <ConfirmationModal
                opened={opened}
                onClose={close}
                cart={cart ?? []}
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </main>
  );
}
