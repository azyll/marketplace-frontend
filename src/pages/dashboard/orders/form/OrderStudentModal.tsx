import { Button, Modal, ModalProps } from "@mantine/core"
import { OrderStudentCreateForm } from "@/pages/dashboard/orders/form/OrderStudentCreateForm"
import { useEffect, useState } from "react"
import { OrderStudentExistingForm } from "@/pages/dashboard/orders/form/OrderStudentExistingForm"
import { useOrderForm } from "@/pages/dashboard/orders/form/index"

interface Props extends ModalProps {
  disabled?: boolean
  onSave?: (existing: boolean) => void
}

export const OrderStudentModal = ({ disabled, onClose, onSave, ...modalProps }: Props) => {
  const { isExistingStudent, setIsExistingStudent, orderStudentForm, orderStudentCreateForm } =
    useOrderForm()

  const [existing, setExisting] = useState(isExistingStudent ?? true)

  useEffect(() => {
    if (isExistingStudent !== existing) {
      setTimeout(() => {
        setExisting(isExistingStudent)
      }, 300)
    }
  }, [modalProps.opened])

  const handleOnClose = () => {
    onClose()

    if (isExistingStudent) {
      orderStudentCreateForm.reset()
    } else {
      orderStudentForm.reset()
    }
  }

  const handleOnSave = () => {
    if (existing) {
      const { hasErrors } = orderStudentForm.validate()

      if (!hasErrors) {
        setIsExistingStudent(existing)
        orderStudentCreateForm.reset()
        onSave?.(true)
      }
      return
    }

    const { hasErrors } = orderStudentCreateForm.validate()

    if (!hasErrors) {
      setIsExistingStudent(existing)
      orderStudentForm.reset()
      onSave?.(false)
    }
  }

  return (
    <Modal
      {...modalProps}
      withCloseButton={false}
      size="lg"
      centered
      closeOnClickOutside={false}
      classNames={{
        body: "!p-6",
      }}
      onClose={handleOnClose}
    >
      <div className="mb-6 flex gap-2">
        <Button variant={existing ? "filled" : "light"} onClick={() => setExisting(true)}>
          Existing Student
        </Button>
        <Button variant={!existing ? "filled" : "light"} onClick={() => setExisting(false)}>
          Create new Student
        </Button>
      </div>

      <div style={{ display: existing ? "block" : "none" }}>
        <OrderStudentExistingForm disabled={disabled} />
      </div>

      <div style={{ display: !existing ? "block" : "none" }}>
        <OrderStudentCreateForm disabled={disabled} />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="transparent" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button onClick={() => handleOnSave()}>Save</Button>
      </div>
    </Modal>
  )
}
