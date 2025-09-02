import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Card,
  Title,
  Divider,
} from "@mantine/core";
import { useNavigate } from "react-router";

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  cart: any[]; // you can replace `any[]` with a proper CartItem[] type later
}

export default function ConfirmationModal({
  opened,
  onClose,
  cart,
}: ConfirmationModalProps) {
  const navigate = useNavigate();

  const total = cart?.reduce(
    (sum: number, item: any) => sum + item.productVariant.price * item.quantity,
    0
  );

  return (
    <Modal
      title={<Title order={3}>Confirm Order</Title>}
      size="lg"
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
    >
      <Stack className="px-4">
        <Text
          size="sm"
          c="dimmed"
        >
          Please review your order before confirming.
        </Text>

        <Card
          withBorder
          radius="md"
          padding="lg"
        >
          <Title
            order={5}
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
              <Text fw={700}>₱{total?.toFixed(2) ?? "0.00"}</Text>
            </Group>
          </Stack>
        </Card>

        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            variant="default"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            color="blue"
            onClick={() => {
              navigate("/order");
            }}
          >
            Place Order
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
