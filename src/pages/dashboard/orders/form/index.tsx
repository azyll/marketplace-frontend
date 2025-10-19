import { Button, Text, Title } from "@mantine/core"

import {
  StudentCardSelect,
  StudentCardSelectProps,
} from "@/pages/dashboard/components/StudentCardSelect"
import { OrderItemsFormTable } from "@/pages/dashboard/orders/form/OrderItemsFormTable"
import { OrderItemsFormCart } from "@/pages/dashboard/orders/form/OrderItemsFormCart"
import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateOrderInput, ICreateOrderStudentInput } from "@/types/order.type"
import { zod4Resolver } from "mantine-form-zod-resolver"
import {
  createOrderItemSchema,
  createOrderStudentCreateSchema,
  createOrderStudentSchema,
} from "@/schema/order.schema"
import { z } from "zod"
import { createContext, useContext, useState } from "react"
import { useDisclosure } from "@mantine/hooks"
import { OrderStudentModal } from "@/pages/dashboard/orders/form/OrderStudentModal"

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

  const [opened, { open, close }] = useDisclosure()

  const handleOnSubmit = () => {
    console.log(orderItemsForm.getValues())
  }

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
      console.log(student)
      setStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        program: student.program,
        id: student.studentNumber,
      })
    }

    close()
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
        <OrderStudentModal opened={opened} onClose={() => close()} onSave={handleOnSaveStudent} />

        <div>
          <Title order={3}>Create Order</Title>

          <Text c="dimmed">
            Create a new order by selecting products and providing student details.
          </Text>
        </div>

        <div className="flex gap-4">
          <div className="flex !basis-auto flex-col gap-4">
            <OrderItemsFormTable />
          </div>

          <div className="flex !basis-[800px] flex-col gap-4">
            <StudentCardSelect
              student={student}
              onSelect={() => open()}
              existing={isExistingStudent}
              onEdit={() => open()}
            />
            <OrderItemsFormCart />
          </div>
        </div>
      </div>
    </OrderFormContext.Provider>
  )
}

export const useOrderForm = () => {
  return useContext(OrderFormContext)
}
