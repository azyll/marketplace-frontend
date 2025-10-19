import { ICart } from "@/types/cart.type"
import { Button, Group, Modal, Stack, Text, Card, Title, Divider, Grid, Image } from "@mantine/core"
import { getImage } from "@/services/media.service"

// Type for buy-now orders from ProductPage
interface BuyNowItem {
  productName: string
  productImage: string
  price: number
  quantity: number
  size?: string
  attributes?: Record<string, string>
}

interface OrderConfirmationModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
  // For cart orders
  cart?: ICart[]
  // For buy-now orders
  buyNowItem?: BuyNowItem
  // Optional custom title
  title?: string
  // Optional warning message
  warningMessage?: string
}

export default function OrderConfirmationModal({
  opened,
  onClose,
  onConfirm,
  isLoading,
  cart,
  buyNowItem,
  title = "Confirm Order",
  warningMessage = "Please review your order before confirming.",
}: OrderConfirmationModalProps) {
  // Calculate total based on order type
  const total = cart
    ? cart.reduce((sum: number, item: any) => sum + item.productVariant.price * item.quantity, 0)
    : buyNowItem
      ? buyNowItem.price * buyNowItem.quantity
      : 0

  // Determine if this is a cart order or buy-now order
  const isCartOrder = !!cart
  const isBuyNowOrder = !!buyNowItem

  return (
    <Modal
      title={title}
      size="lg"
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
    >
      <Stack className="px-4" gap={10}>
        <Text size="sm" c="red">
          {warningMessage}
        </Text>

        <Card withBorder radius="md" padding="lg">
          <Title order={5} mb="md">
            Order Summary
          </Title>

          <Stack gap="sm">
            {/* Header row */}
            <Grid>
              <Grid.Col span={1}>
                <Text size="sm" c="dimmed"></Text>
              </Grid.Col>
              <Grid.Col span={2}>
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

            {/* Cart items - for cart orders */}
            {isCartOrder &&
              cart?.map((item: ICart) => (
                <Grid key={item.id} align="center">
                  <Grid.Col span={1}>
                    <Image
                      src={getImage(item.productVariant.product.image)}
                      alt={item.productVariant.product.name}
                      w={40}
                      h={40}
                      radius="sm"
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Text>{item.quantity} pc(s)</Text>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>
                        {item.productVariant.product.name}
                      </Text>
                      {item.productVariant.size !== "N/A" && (
                        <Text size="xs" c="dimmed">
                          Size: {item.productVariant.size}
                        </Text>
                      )}
                      {item.productVariant.productAttribute?.name !== "N/A" && (
                        <Text size="xs" c="dimmed">
                          {item.productVariant.productAttribute?.name}: {item.productVariant.name}
                        </Text>
                      )}
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4} ta="right">
                    <Text>₱{(item.productVariant.price * item.quantity).toFixed(2)}</Text>
                  </Grid.Col>
                </Grid>
              ))}

            {/* Buy now item - for buy-now orders */}
            {isBuyNowOrder && buyNowItem && (
              <Grid align="center">
                <Grid.Col span={1}>
                  <Image
                    src={getImage(buyNowItem.productImage)}
                    alt={buyNowItem.productName}
                    w={40}
                    h={40}
                    radius="sm"
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text>{buyNowItem.quantity} pc(s)</Text>
                </Grid.Col>
                <Grid.Col span={5}>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {buyNowItem.productName}
                    </Text>
                    {buyNowItem.size && buyNowItem.size !== "N/A" && (
                      <Text size="xs" c="dimmed">
                        Size: {buyNowItem.size}
                      </Text>
                    )}
                    {buyNowItem.attributes &&
                      Object.entries(buyNowItem.attributes).map(([key, value]) => (
                        <Text key={key} size="xs" c="dimmed">
                          {key}: {value}
                        </Text>
                      ))}
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4} ta="right">
                  <Text>₱{(buyNowItem.price * buyNowItem.quantity).toFixed(2)}</Text>
                </Grid.Col>
              </Grid>
            )}

            <Divider />

            {/* Total row */}
            <Grid>
              <Grid.Col span={8}>
                <Text fw={700} size="lg">
                  Total
                </Text>
              </Grid.Col>
              <Grid.Col span={4} ta="right">
                <Text fw={700} size="lg" c="blue">
                  ₱{total.toFixed(2)}
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button color="blue" onClick={onConfirm} loading={isLoading}>
            Place Order
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
