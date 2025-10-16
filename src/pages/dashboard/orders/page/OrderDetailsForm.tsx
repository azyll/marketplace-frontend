import { Button, Card } from "@mantine/core"
import {
  OrderStudentForm,
  OrderStudentFormRef,
} from "@/pages/dashboard/orders/page/OrderStudentForm"
import { useRef, useState } from "react"
import {
  OrderStudentCreateForm,
  OrderStudentCreateFormRef,
} from "@/pages/dashboard/orders/page/OrderStudentCreateForm"
import { OrderItemsForm, OrderItemsFormRef } from "@/pages/dashboard/orders/page/OrderItemsForm"

export const OrderDetailsForm = () => {
  const orderStudentCreateFormRef = useRef<OrderStudentCreateFormRef>(null)
  const orderStudentFormRef = useRef<OrderStudentFormRef>(null)
  const orderItemsFormRef = useRef<OrderItemsFormRef>(null)

  const [existing, setExisting] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Card.Section px={24} py={24}>
          <div className="mb-6 flex gap-4">
            <Button
              variant={existing ? "filled" : "light"}
              onClick={() => setExisting(true)}
              // disabled={isLoading || isFormSubmitting}
            >
              Select Student
            </Button>
            <Button
              variant={!existing ? "filled" : "light"}
              onClick={() => setExisting(false)}
              // disabled={isLoading || isFormSubmitting}
            >
              Add New Student
            </Button>
          </div>

          <div className={existing ? "block" : "hidden"}>
            <OrderStudentForm ref={orderStudentFormRef} />
          </div>

          <div className={!existing ? "block" : "hidden"}>
            <OrderStudentCreateForm ref={orderStudentCreateFormRef} />
          </div>
        </Card.Section>
      </Card>

      <OrderItemsForm ref={orderItemsFormRef} />
    </div>
  )
}
