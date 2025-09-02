import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router";

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ConfirmationModal({
  opened,
  onClose,
}: ConfirmationModalProps) {
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      title="Confirm Order"
      onClose={() => onClose}
      withCloseButton={false}
      centered
    >
      <Stack>
        <Text
          size="sm"
          c="dimmed"
        >
          Are you sure you want to place this order? You can review your cart
          before confirming.
        </Text>

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
