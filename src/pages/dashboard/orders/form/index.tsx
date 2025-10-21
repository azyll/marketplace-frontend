import { Button, Text, Title } from "@mantine/core"

import {
  StudentCardSelect,
  StudentCardSelectProps,
} from "@/pages/dashboard/components/StudentCardSelect"
import { OrderItemsFormTable } from "@/pages/dashboard/orders/form/OrderItemsFormTable"
import { OrderCartItem, OrderItemsFormCart } from "@/pages/dashboard/orders/form/OrderItemsFormCart"
import { useForm, UseFormReturnType } from "@mantine/form"
import {
  ICreateOrderInput,
  ICreateOrderItemInput,
  ICreateOrderStudentInput,
  IOrderItems,
} from "@/types/order.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import {
  createOrderItemSchema,
  createOrderStudentCreateSchema,
  createOrderStudentSchema,
} from "@/schema/order.schema"
import { z } from "zod"
import { createContext, useContext, useEffect, useState } from "react"
import { useDisclosure } from "@mantine/hooks"
import { OrderStudentModal } from "@/pages/dashboard/orders/form/OrderStudentModal"
import { OrderProductModal } from "@/pages/dashboard/orders/form/OrderProductModal"
import { IProduct, IProductVariant } from "@/types/product.type"
import { ICart } from "@/types/cart.type"
import { Link, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProwareOrder } from "@/services/order.service"
import { notifyResponseError } from "@/helper/errorNotification"
import { AxiosError } from "axios"
import { KEY } from "@/constants/key"

export interface OrderFormContextProps {
  orderStudentCreateForm: UseFormReturnType<Partial<ICreateOrderStudentInput>>
  orderStudentForm: UseFormReturnType<Partial<ICreateOrderStudentInput>>
  orderItemsForm: UseFormReturnType<{ orderItems: ICreateOrderInput["orderItems"] }>
  isExistingStudent: boolean
  setIsExistingStudent: (value: boolean) => void
}

export const OrderFormContext = createContext<OrderFormContextProps>({
  orderStudentCreateForm: {} as OrderFormContextProps["orderStudentCreateForm"],
  orderStudentForm: {} as OrderFormContextProps["orderStudentForm"],
  orderItemsForm: {} as OrderFormContextProps["orderItemsForm"],
  isExistingStudent: true,
  setIsExistingStudent: () => {},
})

export const OrderFormPage = () => {
  const orderStudentCreateForm = useForm<Partial<ICreateOrderStudentInput>>({
    initialValues: {
      firstName: undefined,
      lastName: undefined,
      sex: undefined,
      program: undefined,
      studentNumber: undefined,
    },
    validate: zod4Resolver(createOrderStudentCreateSchema),
  })

  const orderStudentForm = useForm<Partial<ICreateOrderStudentInput>>({
    initialValues: {
      firstName: undefined,
      lastName: undefined,
      sex: undefined,
      program: undefined,
      studentNumber: undefined,
    },
    validate: zod4Resolver(createOrderStudentSchema),
  })

  const orderItemsForm = useForm<{ orderItems: ICreateOrderInput["orderItems"] }>({
    initialValues: {
      orderItems: [],
    },
    validate: zod4Resolver(
      z.object({
        orderItems: z.array(createOrderItemSchema).min(1, "At least one order item is required"),
      }),
    ),
  })

  const [cartItems, setCartItems] = useState<OrderCartItem[]>([])

  useEffect(() => {
    orderItemsForm.setFieldValue(
      "orderItems",
      cartItems.map(({ variant, quantity }) => ({ productVariantId: variant.id, quantity })),
    )
  }, [cartItems])

  const [isExistingStudent, setIsExistingStudent] = useState<boolean>(true)

  const [student, setStudent] = useState<StudentCardSelectProps["student"]>()

  const [orderStudentModalOpened, { open: openOrderStudentModal, close: closeOrderStudentModal }] =
    useDisclosure()

  const handleOnSaveStudent = (existing: boolean) => {
    if (existing) {
      const student = orderStudentForm.getValues()

      setStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        program: student.program,
        id: student.studentNumber,
        sex: student.sex,
      })
    } else {
      const student = orderStudentCreateForm.getValues()

      setStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        program: student.program,
        id: student.studentNumber,
        sex: student.sex,
      })
    }

    closeOrderStudentModal()
  }

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const createMutation = useMutation({
    mutationFn: ({
      student,
      orderItems,
    }: {
      student: ICreateOrderStudentInput
      orderItems: ICreateOrderItemInput[]
    }) => createProwareOrder(student, orderItems),
    onSuccess: async ({ data }) => {
      notifications.show({
        color: "green",
        title: "Create Order Success",
        message: `Successfully created Order #${data.id}`,
      })

      await queryClient.invalidateQueries({ queryKey: [KEY.ORDERS] })
      navigate(ROUTES.DASHBOARD.ORDERS.BASE)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Order", "create")
    },
  })

  const handleOnSubmit = () => {
    let hasStudentError = !student?.firstName

    if (isExistingStudent) {
      const { hasErrors } = orderStudentForm.validate()
      if (hasErrors) hasStudentError = true
    } else {
      const { hasErrors } = orderStudentCreateForm.validate()
      if (hasErrors) hasStudentError = true
    }

    if (hasStudentError) {
      notifications.show({
        color: "red",
        title: "Create Order Error",
        message: "Please select a student before creating an order.",
      })
      return
    }

    const { hasErrors } = orderItemsForm.validate()

    if (hasErrors) {
      notifications.show({
        color: "red",
        title: "Create Order Error",
        message: "Please select at least 1 product before creating an order.",
      })
      return
    }

    const order = orderItemsForm.getValues()

    if (student && student?.id) {
      const isStudentNumber10Digits = student.id.toString().length <= 10

      createMutation.mutate({
        student: (isExistingStudent
          ? { studentNumber: isStudentNumber10Digits ? `0${student.id}` : student.id }
          : {
              firstName: student.firstName,
              lastName: student.lastName,
              studentNumber: student.id,
              program: student.program,
              sex: student.sex,
            }) as ICreateOrderStudentInput,
        orderItems: order.orderItems as ICreateOrderItemInput[],
      })
    }
  }

  const [selectedProduct, setSelectedProduct] = useState<IProduct>()
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderCartItem>()

  const [productModalOpened, { open: openProductModal, close: closeProductModal }] = useDisclosure()

  const handleOnSelectProduct = (product: IProduct) => {
    openProductModal()
    setSelectedProduct(product)
  }

  const handleOnCloseProductModal = () => {
    closeProductModal()
    setSelectedProduct(undefined)
    setSelectedOrderItem(undefined)
  }

  const handleOnAddToCart = (variant: IProductVariant, quantity: number) => {
    if (!selectedProduct) return

    let isAdd = true

    setCartItems((prev) => {
      return prev.map((item) => {
        const exists = item.product.id === selectedProduct.id && variant.id === item.variant.id

        if (exists) {
          isAdd = false

          return {
            ...item,
            quantity: item.quantity + quantity,
          }
        }

        return item
      })
    })

    if (isAdd) {
      setCartItems((prev) => [
        ...prev,
        {
          product: selectedProduct,
          variant,
          quantity,
        },
      ])
    }

    handleOnCloseProductModal()
  }

  const handleOnUpdateCart = (
    oldVariant: IProductVariant,
    variant: IProductVariant,
    quantity: number,
  ) => {
    if (!selectedProduct) return

    setCartItems((prev) => {
      return prev.map((item) => {
        const exists = item.product.id === selectedProduct.id && oldVariant.id === item.variant.id

        // Update the product variant and quantity
        if (exists) {
          return {
            ...item,
            variant,
            quantity,
          }
        }

        return item
      })
    })

    handleOnCloseProductModal()
  }

  const handleOnEditOrderItem = (item: OrderCartItem) => {
    setSelectedOrderItem(item)
    setSelectedProduct(item.product)
    openProductModal()
  }

  const handleOnDeleteOrderItem = (orderCartItem: OrderCartItem) => {
    setCartItems((prev) => {
      return prev.filter(
        (item) =>
          item.product.id !== orderCartItem.product.id &&
          item.variant.id !== orderCartItem.variant.id,
      )
    })
  }

  return (
    <OrderFormContext.Provider
      value={{
        orderStudentCreateForm,
        orderStudentForm,
        orderItemsForm,
        isExistingStudent,
        setIsExistingStudent: (value: boolean) => setIsExistingStudent(value),
      }}
    >
      <div className="flex flex-col gap-4">
        <OrderStudentModal
          opened={orderStudentModalOpened}
          onClose={() => closeOrderStudentModal()}
          onSave={handleOnSaveStudent}
        />

        <OrderProductModal
          product={selectedProduct}
          opened={productModalOpened}
          onClose={() => handleOnCloseProductModal()}
          onAddToCart={handleOnAddToCart}
          onUpdateCart={handleOnUpdateCart}
          initialQuantity={selectedOrderItem?.quantity}
          initialVariant={selectedOrderItem?.variant}
        />

        <div className="flex items-end justify-between gap-4">
          <div>
            <Title order={3}>Create Order</Title>

            <Text c="dimmed">
              Create a new order by selecting products and providing student details.
            </Text>
          </div>

          <div className="flex gap-2">
            <Button
              variant="subtle"
              component={Link}
              to={ROUTES.DASHBOARD.ORDERS.BASE}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={() => handleOnSubmit()} loading={createMutation.isPending}>
              Create Order
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="min-w-0 basis-full">
            <OrderItemsFormTable
              onProductSelect={handleOnSelectProduct}
              disabled={createMutation.isPending}
            />
          </div>

          <div className="flex !basis-[600px] flex-col gap-4">
            <StudentCardSelect
              student={student}
              existing={isExistingStudent}
              onSelect={() => openOrderStudentModal()}
              onEdit={() => openOrderStudentModal()}
              disabled={createMutation.isPending}
            />
            <OrderItemsFormCart
              items={cartItems}
              onEdit={handleOnEditOrderItem}
              onDelete={handleOnDeleteOrderItem}
              disabled={createMutation.isPending}
            />
          </div>
        </div>
      </div>
    </OrderFormContext.Provider>
  )
}

export const useOrderForm = () => {
  return useContext(OrderFormContext)
}
