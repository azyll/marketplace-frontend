import { AuthContext } from "@/contexts/AuthContext"
import { getImage } from "@/services/media.service"
import { getItems, removeItem, addItemQuantity, deductItemQuantity } from "@/services/cart.service"
import { createOrder } from "@/services/order.service"
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { IconMoodSad, IconTrash } from "@tabler/icons-react"
import { useContext, useEffect, useMemo, useState } from "react"
import CartItemSkeleton from "./components/CartItemSkeleton"
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { useDisclosure, useInViewport } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useNavigate } from "react-router"
import QuantityInput from "../products/components/QuantityInput"
import OrderConfirmationModal from "./components/OrderConfirmationModal"
import { ICart } from "@/types/cart.type"
import { notifyResponseError } from "@/helper/errorNotification"
import { AxiosError } from "axios"
import { KEY } from "@/constants/key"

export default function Cart() {
  const { user } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // State for selected items
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  const {
    data: cartData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [KEY.CART, user?.id],
    queryFn: async ({ pageParam }) => await getItems(user!.id, { page: pageParam, limit: 10 }),
    initialPageParam: 1,
    enabled: !!user?.id,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta.currentPage
      const totalPages = Math.ceil(lastPage.meta.totalItems / lastPage.meta.itemsPerPage)
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
  })
  const cartItems = useMemo(() => cartData?.pages.flatMap((page) => page.data) || [], [cartData])
  const totalItems = useMemo(() => cartData?.pages[0].meta.totalItems || 0, [cartData])

  const { ref, inViewport: inView } = useInViewport()
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (variantId: string) => removeItem(user!.id, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id] })
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id, KEY.CART_TOTAL] })
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Cart", "remove")
    },
  })

  // Add quantity mutation
  const addQuantityMutation = useMutation({
    mutationFn: (cartId: number) => addItemQuantity(user!.id, cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id] })
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id, KEY.CART_TOTAL] })
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Cart", "create")
    },
  })

  // Deduct quantity mutation
  const deductQuantityMutation = useMutation({
    mutationFn: (cartId: number) => deductItemQuantity(user!.id, cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id] })
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id, KEY.CART_TOTAL] })
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Cart", "remove")
    },
  })

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: () => {
      if (!cartData || error || cartItems.length <= 0 || !user?.id)
        throw new Error("Missing cart or user data")

      // Only create order for selected items
      const selectedCartItems = cartItems.filter((item: ICart) => selectedItems.has(item.id))

      if (selectedCartItems.length === 0) {
        throw new Error("Please select at least one item to order")
      }

      const orderItems = selectedCartItems.map((item: any) => ({
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

      // Clear selected items
      setSelectedItems(new Set())

      navigate(`/order/${order.data.id}?orderType=cart`)
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id] })
      queryClient.invalidateQueries({ queryKey: [KEY.CART, user?.id, KEY.CART_TOTAL] })
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Order", "create")
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

  // Custom quantity handler
  const handleQuantityChange = (currentQuantity: number, newQuantity: number, cartId: number) => {
    if (newQuantity > currentQuantity) {
      const difference = newQuantity - currentQuantity
      for (let i = 0; i < difference; i++) {
        addQuantityMutation.mutate(cartId)
      }
    } else if (newQuantity < currentQuantity) {
      const difference = currentQuantity - newQuantity
      for (let i = 0; i < difference; i++) {
        deductQuantityMutation.mutate(cartId)
      }
    }
  }

  // Checkbox handlers
  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (!cartData && cartItems.length < 0) return
    // Filter out items that are out of stock

    const availableItems = cartItems.filter(
      (item: ICart) => item.productVariant.stockCondition !== "out-of-stock",
    )
    const availableItemIds = availableItems.map((item: ICart) => item.id)

    if (selectedItems.size === availableItemIds.length) {
      // Deselect all
      setSelectedItems(new Set())
    } else {
      // Select all available items only
      setSelectedItems(new Set(availableItemIds))
    }
  }
  const isSelectAllChecked = () => {
    if (!cartData) return false

    // Get all items (filter out out-of-stock items)
    const allItems = cartItems.filter(
      (item: ICart) => item.productVariant.stockCondition !== "out-of-stock",
    )
    const allItemIds = allItems.map((item: ICart) => item.id)

    // If all available items are selected, return true
    return selectedItems.size === allItemIds.length
  }

  const isSelectAllIndeterminate = () => {
    if (!cartData) return false

    // Get all items (filter out out-of-stock items)
    const allItems = cartItems.filter(
      (item: ICart) => item.productVariant.stockCondition !== "out-of-stock",
    )
    const allItemIds = allItems.map((item: ICart) => item.id)

    // If some, but not all, items are selected
    return selectedItems.size > 0 && selectedItems.size < allItemIds.length
  }

  // Calculate total for selected items only
  const selectedTotal =
    cartData && cartItems.length > 0 && !error
      ? cartItems.reduce(
          (sum: number, item: any) => sum + item.productVariant.price * item.quantity,
          0,
        )
      : 0

  // Get selected cart items for order summary
  const selectedCartItems = cartItems.filter((item: ICart) => selectedItems.has(item.id)) || []

  return (
    <main className="relative mx-auto max-w-[1200px]">
      {error ? (
        <Badge variant="light" color="red">
          error {error.message}
        </Badge>
      ) : null}
      <Grid gutter="xl" mt="md" px={{ base: 16, sm: "xl", xl: 0 }}>
        {/* Cart items */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md">
            <Stack gap="md">
              <Group gap={8} align="center">
                <Title order={4}>My Cart</Title>
                <Badge>{totalItems}</Badge>
              </Group>

              {cartData && !error && totalItems > 0 && (
                <>
                  <Checkbox
                    label="Select All"
                    checked={isSelectAllChecked()}
                    indeterminate={isSelectAllIndeterminate()}
                    onChange={handleSelectAll}
                  />
                  {totalItems > 10 && (
                    <Text size="xs" c={"gray"}>
                      Scroll down to load all items before selecting all. Currently loaded:{" "}
                      <strong>{cartItems.length}</strong>.
                      {isSelectAllIndeterminate() && (
                        <Text size="xs" c="red" component="span">
                          {" "}
                          Some items are not yet loaded, so the checkbox may not be fully updated.
                        </Text>
                      )}
                    </Text>
                  )}
                </>
              )}

              {/* Scrollable container */}
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <Stack gap="md">
                  {isLoading && !user ? (
                    Array.from({ length: 2 }).map((_, i) => <CartItemSkeleton key={i} />)
                  ) : cartData && !error && totalItems > 0 && cartItems.length > 0 ? (
                    cartItems.map((data: ICart) => (
                      <Card
                        key={data.id}
                        withBorder
                        radius="md"
                        padding="md"
                        className={`relative transition-opacity ${
                          isRemoving || isUpdatingQuantity ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          <Group align="flex-start" wrap="nowrap" style={{ flex: 1 }}>
                            <Checkbox
                              checked={selectedItems.has(data.id)}
                              onChange={() => handleSelectItem(data.id)}
                              mt={4}
                              disabled={data.productVariant.stockCondition === "out-of-stock"}
                            />

                            <Image
                              src={getImage(data.productVariant.product.image)}
                              alt={data.productVariant.name}
                              onClick={() =>
                                navigate(`/products/${data.productVariant.product.productSlug}`)
                              }
                              className="cursor-pointer"
                              radius="md"
                              w={80}
                              h={80}
                            />

                            <Stack gap={4} style={{ flex: 1 }}>
                              <Text
                                fw={500}
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate(`/products/${data.productVariant.product.productSlug}`)
                                }
                                truncate
                              >
                                {data.productVariant.product.name}
                              </Text>

                              <Text size="sm">
                                <NumberFormatter
                                  prefix="₱ "
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
                                    {data.productVariant.name}, {""}
                                    {data.productVariant.size !== "N/A" && data.productVariant.size}
                                  </>
                                )}
                              </Text>

                              <QuantityInput
                                quantity={data.quantity}
                                setQuantity={(newQuantity) =>
                                  handleQuantityChange(data.quantity, newQuantity, data.id)
                                }
                              />

                              {data.productVariant.stockCondition === "out-of-stock" ? (
                                <Text size="xs" c="red">
                                  Out of stock
                                </Text>
                              ) : (
                                <Text size="xs">
                                  {data.productVariant.stockAvailable} available
                                </Text>
                              )}
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
                  ) : cartData && totalItems === 0 ? (
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
                  {hasNextPage ? (
                    <div
                      ref={ref}
                      className="flex h-10 flex-col items-center justify-center text-center"
                    >
                      {isFetchingNextPage && <Loader />}
                    </div>
                  ) : null}
                </Stack>
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Order summary */}
        {!cartData || error || totalItems === 0 ? null : (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" padding="lg" mih={250}>
              <Title order={4} mb="xs">
                Order Summary{" "}
                <span className="text-sm text-gray-500">
                  {selectedItems.size > 0 && `(${selectedItems.size} selected)`}
                </span>
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

                {/* Selected cart items */}
                {selectedCartItems.length > 0 ? (
                  selectedCartItems.map((item: ICart) => (
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
                        <NumberFormatter
                          prefix="₱ "
                          decimalScale={2}
                          thousandSeparator
                          decimalSeparator="."
                          fixedDecimalScale
                          value={item.productVariant.price * item.quantity}
                        />
                      </Grid.Col>
                    </Grid>
                  ))
                ) : (
                  <Grid align="center">
                    <Grid.Col span={3}>
                      <Text size="sm" c="dimmed">
                        -
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={5}>
                      <Text size="sm" c="dimmed">
                        -
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={4} ta="right">
                      <Text size="sm" c="dimmed">
                        -
                      </Text>
                    </Grid.Col>
                  </Grid>
                )}

                <Divider />

                {/* Total row */}
                <Grid>
                  <Grid.Col span={8}>
                    <Text fw={700}>Total</Text>
                  </Grid.Col>
                  <Grid.Col span={4} ta="right">
                    <Text fw={700}>
                      {" "}
                      <NumberFormatter
                        prefix="₱ "
                        decimalScale={2}
                        thousandSeparator
                        decimalSeparator="."
                        fixedDecimalScale
                        value={selectedTotal}
                      />
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
                  disabled={selectedItems.size === 0 || isCreatingOrder || isUpdatingQuantity}
                  loading={isCreatingOrder}
                >
                  Place Order
                </Button>

                {/* Confirmation modal */}
                <OrderConfirmationModal
                  opened={opened}
                  onClose={close}
                  cart={selectedCartItems}
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
