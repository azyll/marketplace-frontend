import { AuthContext } from "@/contexts/AuthContext"
import { getImage } from "@/services/media.service"
import { getItems, removeItem } from "@/services/cart.service"
import { createOrder } from "@/services/order.service" // Import your order service
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { IconMoodSad, IconTemperature, IconTrash, IconX } from "@tabler/icons-react"
import { useContext } from "react"
import CartItemSkeleton from "./components/CartItemSkeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDisclosure } from "@mantine/hooks"
import ConfirmationModal from "./components/ConfirmationModal"
import { notifications } from "@mantine/notifications"
import { useNavigate } from "react-router"
import QuantityInput from "../products/components/QuantityInput"

export default function Cart() {
  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch cart items
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getItems(user!.id),
    enabled: !!user?.id, // only run if user is logged in
  })

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (variantId: string) => removeItem(user!.id, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] })
    },
  })

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!cart || !user?.id) throw new Error("Missing cart or user data")

      // Transform cart items to the format expected by createOrder
      const orderItems = cart.map((item: any) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      }))

      console.log("Creating order with studentId:", user?.id)
      console.log("Order items:", orderItems)

      return createOrder(user?.id, orderItems, "cart")
    },
    onSuccess: (order) => {
      notifications.show({
        title: "Success!",
        message: "Your order has been created successfully.",
        color: "green",
      })

      // Clear cart query since items are now ordered
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] })

      // Navigate to order confirmation page with orderType parameter
      navigate(`/order/${order.id}?orderType=cart`)
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create order. Please try again.",
        color: "red",
      })
    },
  })

  const isRemoving = removeMutation.isPending
  const isCreatingOrder = createOrderMutation.isPending

  const [opened, { open, close }] = useDisclosure(false)

  const handlePlaceOrder = () => {
    createOrderMutation.mutate()
    close()
  }

  return (
    <main className="relative mx-auto max-w-[1200px]">
      <Grid gutter="xl" mt="md" px={{ base: 16, sm: "xl", xl: 0 }}>
        {/* Cart items */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack gap="md">
            <Title order={4}>My Cart - {cart?.length} item(s)</Title>

            {isLoading && !user ? (
              // Skeletons while loading
              Array.from({ length: 2 }).map((_, i) => <CartItemSkeleton key={i} />)
            ) : cart && cart.length > 0 ? (
              cart.map((data: any) => (
                <Card
                  key={data.id}
                  withBorder
                  radius="md"
                  padding="md"
                  className={`relative transition-opacity ${
                    isRemoving ? "pointer-events-none opacity-50" : ""
                  } `}
                  //   onClick={() =>
                  //     navigate(`/products/${cart[0].productVariant.product.productSlug}`)
                  //   }
                >
                  <Group justify="space-between" align="flex-start">
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

                        <Text size="sm">
                          <NumberFormatter
                            prefix="₱"
                            decimalScale={2}
                            thousandSeparator
                            decimalSeparator="."
                            fixedDecimalScale
                            value={data.productVariant.price * data.quantity}
                          />
                        </Text>

                        <Text size="xs" c="dimmed">
                          {data.productVariant.productAttribute?.name !== "N/A" && (
                            <>
                              {data.productVariant.productAttribute?.name}:{" "}
                              {data.productVariant.name}
                              <br />
                            </>
                          )}

                          {data.productVariant.size !== "N/A" &&
                            `Size: ${data.productVariant.size}`}
                        </Text>

                        <QuantityInput quantity={data.quantity} setQuantity={() => {}} />
                      </Stack>
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      radius="xl"
                      color="gray"
                      onClick={() => {
                        removeMutation.mutate(data.productVariantId)
                      }}
                      loading={isRemoving}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))
            ) : cart && cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <IconMoodSad color="gray" size={32} stroke={1.5} />

                <Text ta="center" c="dimmed">
                  No items in cart.
                </Text>
              </div>
            ) : null}
          </Stack>
        </Grid.Col>

        {/* Order summary */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card className="sticky bottom-0" mt="42" withBorder radius="md" padding="lg">
            <Title order={4} mb="md">
              Order Summary
            </Title>

            <Stack gap="sm">
              {/* Header row */}
              <Grid>
                <Grid.Col span={2}>
                  <Text fw={600}>Qty</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={600}>Item</Text>
                </Grid.Col>
                <Grid.Col span={4} ta="right">
                  <Text fw={600}>Price (₱)</Text>
                </Grid.Col>
              </Grid>

              {/* Cart items */}
              {cart?.map((item: any) => (
                <Grid key={item.id} align="center">
                  <Grid.Col span={2}>
                    <Text c="dimmed">{item.quantity} pc(s)</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text>
                      {item.productVariant.product.name}{" "}
                      <span className="text-gray-400">({item.productVariant.size})</span>
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4} ta="right">
                    <Text>{(item.productVariant.price * item.quantity).toFixed(2)}</Text>
                  </Grid.Col>
                </Grid>
              ))}

              <Divider />

              {/* Total row */}
              <Grid>
                <Grid.Col span={8}>
                  <Text fw={700}>Total</Text>
                </Grid.Col>
                <Grid.Col span={4} ta="right">
                  <Text fw={700}>
                    ₱
                    {cart
                      ? cart
                          .reduce(
                            (sum: number, item: any) =>
                              sum + item.productVariant.price * item.quantity,
                            0,
                          )
                          .toFixed(2)
                      : "0.00"}
                  </Text>
                </Grid.Col>
              </Grid>

              {/* Place order button */}
              <Button
                fullWidth
                mt="md"
                size="md"
                radius="xl"
                onClick={open}
                disabled={!cart || cart.length === 0 || isCreatingOrder}
                loading={isCreatingOrder}
              >
                Place Order
              </Button>

              {/* Confirmation modal */}
              <ConfirmationModal
                opened={opened}
                onClose={close}
                cart={cart ?? []}
                onConfirm={handlePlaceOrder}
                isLoading={isCreatingOrder}
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </main>
  )
}
