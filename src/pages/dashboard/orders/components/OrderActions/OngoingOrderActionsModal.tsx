import { ActionIcon, Button, Group, Modal, ModalProps, Text, ThemeIcon, Title } from "@mantine/core"
import { useMemo } from "react"
import pluralize from "pluralize"
import { IconProgressCheck, IconTrash, IconTrashX, IconX } from "@tabler/icons-react"

interface Props extends ModalProps {
  actionType?: "cancel" | "confirm"
  itemsCount: number
  onYes: () => void
  loading?: boolean
}

export const OngoingOrderActionsModal = ({
  actionType,
  itemsCount,
  onYes,
  loading,
  ...modalProps
}: Props) => {
  const infinitiveLabel = useMemo(
    () => (actionType === "cancel" ? "Cancel" : "Confirm"),
    [actionType],
  )

  return (
    <Modal
      {...modalProps}
      withCloseButton={false}
      centered
      padding={18}
      closeOnClickOutside={!loading}
    >
      {/*  Icon */}
      <div className="mt-2 flex w-full justify-center">
        {actionType === "confirm" ? (
          <ThemeIcon variant="transparent" color="blue.6" size={48}>
            <IconProgressCheck size={48} stroke={2} />
          </ThemeIcon>
        ) : (
          <ThemeIcon variant="transparent" color="red" size={48}>
            <IconX size={48} stroke={2} />
          </ThemeIcon>
        )}
      </div>

      {/* Title */}
      <Title order={4} ta="center" mt="lg">
        {infinitiveLabel} {pluralize("Order", itemsCount)}
      </Title>

      {/*  Description */}
      <div className="mx-auto max-w-[340px]">
        <Text ta="center" size="sm" c="dimmed">
          Do you really want to {infinitiveLabel.toLocaleLowerCase()}{" "}
          {itemsCount > 1 ? itemsCount : "this"} {pluralize("order", itemsCount)}? This action
          cannot be undone.
        </Text>
      </div>

      {/* Action Buttons */}
      <Group mt={56} justify="end">
        <Button
          variant="subtle"
          color="gray"
          onClick={() => modalProps.onClose()}
          disabled={loading}
        >
          No, don't {infinitiveLabel.toLocaleLowerCase()} {itemsCount <= 1 ? "" : itemsCount}{" "}
          {pluralize("order", itemsCount)}
        </Button>

        <Button
          color={actionType === "cancel" ? "red" : "blue"}
          onClick={() => onYes()}
          loading={loading}
        >
          Yes, {infinitiveLabel.toLocaleLowerCase()} {itemsCount <= 1 ? "" : itemsCount}{" "}
          {pluralize("order", itemsCount)}
        </Button>
      </Group>
    </Modal>
  )
}
