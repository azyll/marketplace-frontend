import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Divider,
  Group,
  Modal,
  ModalProps,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core"
import { IOrder } from "@/types/order.type"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { OrderItem } from "@/pages/dashboard/orders/page/OrderItem"
import { useEffect, useMemo, useState } from "react"
import pluralize from "pluralize"

interface Props extends Omit<ModalProps, "onSubmit"> {
  order: IOrder
  onSubmit: (salesInvoice: string) => void
  loading?: boolean
  remaining: number
}

export const ConfirmOrderActionsModal = ({
  order,
  onSubmit,
  loading,
  remaining = 0,
  ...modalProps
}: Props) => {
  const student = useMemo(() => order?.student, [order])

  const [salesInvoice, setSalesInvoice] = useState<string>("")

  useEffect(() => {
    setSalesInvoice("")
  }, [modalProps.opened, order, remaining])

  return (
    <Modal
      {...modalProps}
      withCloseButton={false}
      centered
      padding={24}
      closeOnClickOutside={false}
      size="lg"
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <Title order={4}>Complete Order</Title>

        {remaining > 0 && (
          <Text size="sm" c={"dimmed"}>
            {remaining} {pluralize("order", remaining)} remaining
          </Text>
        )}
      </div>

      {/*<Text size="sm" c="dimmed">*/}
      {/*  Do you really want to complete this order? This action cannot be undone.*/}
      {/*</Text>*/}

      <div className="mt-4 grid grid-cols-2 divide-x divide-neutral-200">
        <Card withBorder p={16} radius={0} className="!border-b-0">
          <p className="text-sm font-semibold">{student?.user.fullName}</p>
          <p className="mt-1 text-sm text-neutral-500">
            {student?.user.username}@fairview.sti.edu.ph
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-500">{student?.id}</p>
            <CopyButton value={order.id} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Student ID"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        </Card>

        <Card withBorder p={16} radius={0} className="!border-b-0 !border-l-0">
          <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-700"># {order.id} </p>
            <CopyButton value={order.id} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Order #"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-700">₱ {order.total.toLocaleString()}</p>
            <CopyButton value={order.total.toString()} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Total"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>
        </Card>
      </div>

      <Divider mt={0} />

      <Card withBorder p={0} radius={0} className="!border-t-0">
        <div className="divide-y divide-neutral-200">
          {order?.orderItems?.map((item, index) => (
            <div className="p-4" key={index}>
              <OrderItem item={item} size="sm" padding={0} bordered={false} />
            </div>
          ))}
        </div>
      </Card>

      <TextInput
        mt={16}
        placeholder="Sales Invoice"
        key={order.id}
        type="number"
        value={salesInvoice.replace("FAI", "")}
        onChange={(e) => setSalesInvoice("FAI" + e.target.value)}
        leftSection={"FAI"}
      />

      {/* Action Buttons */}
      <Group mt={40} justify="end">
        <Button
          variant="subtle"
          color="gray"
          onClick={() => modalProps.onClose()}
          disabled={loading}
        >
          No, don't complete order
        </Button>

        <Button
          color="green"
          onClick={() => onSubmit(salesInvoice ?? "")}
          disabled={!salesInvoice.replace("FAI", "")}
          loading={loading}
        >
          Yes, complete order
        </Button>
      </Group>
    </Modal>
  )
}
