import { Text, Title } from "@mantine/core"

import {
  StudentCardSelect,
  StudentCardSelectProps,
} from "@/pages/dashboard/components/StudentCardSelect"
import { OrderItemsFormTable } from "@/pages/dashboard/orders/form/OrderItemsFormTable"
import { OrderCartItem, OrderItemsFormCart } from "@/pages/dashboard/orders/form/OrderItemsFormCart"
import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateOrderInput, ICreateOrderStudentInput, IOrderItems } from "@/types/order.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createOrderItemSchema, createOrderStudentCreateSchema } from "@/schema/order.schema"
import { z } from "zod"
import { createContext, useContext, useState } from "react"
import { useDisclosure } from "@mantine/hooks"
import { OrderStudentModal } from "@/pages/dashboard/orders/form/OrderStudentModal"
import { OrderProductModal } from "@/pages/dashboard/orders/form/OrderProductModal"
import { IProduct, IProductVariant } from "@/types/product.type"
import { ICart } from "@/types/cart.type"

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
    validate: zod4Resolver(createOrderStudentCreateSchema),
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
      })
    } else {
      const student = orderStudentCreateForm.getValues()

      setStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        program: student.program,
        id: student.studentNumber,
      })
    }

    closeOrderStudentModal()
  }

  const handleOnSubmit = () => {
    console.log(orderItemsForm.getValues())
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

  const [cartItems, setCartItems] = useState<OrderCartItem[]>([])

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

        <div>
          <Title order={3}>Create Order</Title>

          <Text c="dimmed">
            Create a new order by selecting products and providing student details.
          </Text>
        </div>

        <div className="flex gap-4">
          <div className="min-w-0 basis-full">
            <OrderItemsFormTable onProductSelect={handleOnSelectProduct} />
          </div>

          <div className="flex !basis-[600px] flex-col gap-4">
            <StudentCardSelect
              student={student}
              existing={isExistingStudent}
              onSelect={() => openOrderStudentModal()}
              onEdit={() => openOrderStudentModal()}
            />
            <OrderItemsFormCart
              items={cartItems}
              onEdit={handleOnEditOrderItem}
              onDelete={handleOnDeleteOrderItem}
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
