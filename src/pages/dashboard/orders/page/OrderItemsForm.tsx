import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateUserInput, IUser } from "@/types/user.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createUserSchema, updateUserSchema } from "@/schema/user.schema"
import { ICreateOrderInput, ICreateOrderItemInput } from "@/types/order.type"
import { createOrderItemSchema } from "@/schema/order.schema"
import { z } from "zod"
import { Ref, useImperativeHandle } from "react"
import { ComboboxItem } from "@mantine/core"
import { OrderItemsFormTable } from "@/pages/dashboard/orders/page/OrderItemsFormTable"
import { OrderItemsFormCart } from "@/pages/dashboard/orders/page/OrderItemsFormCart"

export interface OrderItemsFormRef {
  form: UseFormReturnType<{ orderItems: ICreateOrderInput["orderItems"] }>
}

interface Props {
  ref: Ref<OrderItemsFormRef>
  disabled?: boolean
}

export const OrderItemsForm = ({ ref, disabled }: Props) => {
  const form = useForm<{ orderItems: ICreateOrderInput["orderItems"] }>({
    initialValues: {
      orderItems: [],
    },
    validate: zod4Resolver(
      z.object({
        orderItems: z.array(createOrderItemSchema).min(1, "At least one order item is required"),
      }),
    ),
  })

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <div className="flex gap-4">
      <OrderItemsFormTable />

      <OrderItemsFormCart />
    </div>
  )
}
