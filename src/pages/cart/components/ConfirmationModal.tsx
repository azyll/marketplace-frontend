import { Button, Group, Modal, Stack, Text, Card, Title, Divider, Grid } from "@mantine/core"

interface ConfirmationModalProps {
  opened: boolean
  onClose: () => void
  cart: any[] // you can replace `any[]` with a proper CartItem[] type later
  onConfirm: () => void
  isLoading: boolean
}

export default function ConfirmationModal({
  opened,
  onClose,
  cart,
  onConfirm,
  isLoading,
}: ConfirmationModalProps) {
  const total = cart?.reduce(
    (sum: number, item: any) => sum + item.productVariant.price * item.quantity,
    0,
  )

  return (
    <Modal
      title="Confirm Order"
      size="lg"
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
    >
      <Stack className="px-4">
        <Text size="sm" c="dimmed">
          Please review your order before confirming.
        </Text>

        <Card withBorder radius="md" padding="lg">
          <Title order={5} mb="md">
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
                <Text fw={600}>Price</Text>
              </Grid.Col>
            </Grid>

            {/* Cart items */}
            {cart?.map((item: any, idx: number) => (
              <Grid key={item.id} align="center">
                <Grid.Col span={2}>
                  <Text c="dimmed">{item.quantity} pc(s)</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text>{item.productVariant.product.name}</Text>
                </Grid.Col>
                <Grid.Col span={4} ta="right">
                  <Text>₱{(item.productVariant.price * item.quantity).toFixed(2)}</Text>
                </Grid.Col>
              </Grid>
            ))}

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
                  ₱{total?.toFixed(2) ?? "0.00"}
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
