import { AuthContext } from "@/contexts/AuthContext"
import { getImage } from "@/services/media.service"
import { getItems, removeItem, addItemQuantity, deductItemQuantity } from "@/services/cart.service"
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
import { IconMoodSad, IconTrash } from "@tabler/icons-react"
import { useContext } from "react"
import CartItemSkeleton from "./components/CartItemSkeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useNavigate } from "react-router"
import QuantityInput from "../products/components/QuantityInput"
import OrderConfirmationModal from "./components/OrderConfirmationModal"

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

  // Add quantity mutation
  const addQuantityMutation = useMutation({
    mutationFn: (cartId: number) => addItemQuantity(user!.id, cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] })
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      })
    },
  })

  // Deduct quantity mutation
  const deductQuantityMutation = useMutation({
    mutationFn: (cartId: number) => deductItemQuantity(user!.id, cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] })
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      })
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

      return createOrder(user?.id, orderItems, "cart")
    },
    onSuccess: (order) => {
      notifications.show({
        title: "Success!",
        message: order.message,
        color: "green",
      })

      // Clear cart query since items are now ordered
      // queryClient.invalidateQueries({ queryKey: ["cart", user?.id] })

      // Navigate to order confirmation page with orderType parameter
      navigate(`/order/${order.data.id}?orderType=cart`)
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      })
    },
  })

  const isRemoving = removeMutation.isPending
  const isCreatingOrder = createOrderMutation.isPending
  const isUpdatingQuantity = addQuantityMutation.isPending || deductQuantityMutation.isPending

  const [opened, { open, close }] = useDisclosure(false)

  const handlePlaceOrder = () => {
    createOrderMutation.mutate()
    close()
  }

  // Custom quantity handler that works with your cart service
  const handleQuantityChange = (currentQuantity: number, newQuantity: number, cartId: number) => {
    if (newQuantity > currentQuantity) {
      // Increase quantity
      const difference = newQuantity - currentQuantity
      for (let i = 0; i < difference; i++) {
        addQuantityMutation.mutate(cartId)
      }
    } else if (newQuantity < currentQuantity) {
      // Decrease quantity
      const difference = currentQuantity - newQuantity
      for (let i = 0; i < difference; i++) {
        deductQuantityMutation.mutate(cartId)
      }
    }
  }

  return (
    <main className="relative mx-auto max-w-[1200px]">
      <Grid gutter="xl" mt="md" px={{ base: 16, sm: "xl", xl: 0 }}>
        {/* Cart items */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            {cart?.length === 0 ? (
              <Title order={4}>My Cart</Title>
            ) : (
              <Title order={4}>My Cart - {cart?.length} item(s)</Title>
            )}

            {isLoading && !user ? (
              // Skeletons while loading
              Array.from({ length: 2 }).map((_, i) => <CartItemSkeleton key={i} />)
            ) : cart && cart.length > 0 ? (
              cart.map((data: any) => (
                //Cart Items
                <Card
                  key={data.id}
                  withBorder
                  radius="md"
                  padding="md"
                  className={`relative transition-opacity ${
                    isRemoving || isUpdatingQuantity ? "pointer-events-none opacity-50" : ""
                  } `}
                >
                  <Group justify="space-between" align="flex-start">
                    <Group align="flex-start">
                      <Image
                        src={getImage(data.productVariant.product.image)}
                        alt={data.productVariant.name}
                        onClick={() =>
                          navigate(`/products/${cart[0].productVariant.product.productSlug}`)
                        }
                        className="cursor-pointer"
                        radius="md"
                        w={80}
                        h={80}
                      />

                      {/* Text Labels & Quantity */}
                      <Stack gap={4}>
                        <Text
                          fw={500}
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/products/${cart[0].productVariant.product.productSlug}`)
                          }
                          truncate
                        >
                          {data.productVariant.product.name}
                        </Text>

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

                        <QuantityInput
                          quantity={data.quantity}
                          setQuantity={(newQuantity) =>
                            handleQuantityChange(data.quantity, newQuantity, data.id)
                          }
                        />
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
              //Empty cart
              <Card h={300} w="100%" bg="#e9edf3" padding="sm" radius="md">
                <div className="flex h-full flex-col items-center justify-center">
                  <IconMoodSad color="gray" size={32} stroke={1.5} />

                  <Text ta="center" c="dimmed">
                    No items in cart.
                  </Text>

                  <Button mt="sm" radius="xl" onClick={() => navigate("/products")}>
                    Browse products
                  </Button>
                </div>
              </Card>
            ) : null}
          </Stack>
        </Grid.Col>

        {/* Order summary */}
        {!cart || cart.length === 0 ? null : (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card mt="42" withBorder radius="md" padding="lg" mih={250}>
              <Title order={4} mb="xs">
                Order Summary
              </Title>

              <Stack gap={5}>
                {/* Header row */}
                <Grid>
                  <Grid.Col span={3}>
                    <Text size="sm" c="dimmed">
                      Qty
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Text size="sm" c="dimmed">
                      Item
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4} ta="right">
                    <Text size="sm" c="dimmed">
                      Amount
                    </Text>
                  </Grid.Col>
                </Grid>

                {/* Cart items */}
                {cart?.map((item) => (
                  <Grid key={item.id} align="center">
                    <Grid.Col span={3}>
                      <Text>{item.quantity} pc(s)</Text>
                    </Grid.Col>
                    <Grid.Col span={5}>
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
                  disabled={!cart || cart.length === 0 || isCreatingOrder || isUpdatingQuantity}
                  loading={isCreatingOrder}
                >
                  Place Order
                </Button>

                {/* Confirmation modal */}
                <OrderConfirmationModal
                  opened={opened}
                  onClose={close}
                  cart={cart ?? []}
                  onConfirm={handlePlaceOrder}
                  isLoading={isCreatingOrder}
                />
              </Stack>
            </Card>
          </Grid.Col>
        )}
      </Grid>
    </main>
  )
}
