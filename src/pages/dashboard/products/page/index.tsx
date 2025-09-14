import { Box, Button, Card, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { useMemo } from "react"
import { useNavigate, useParams } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ROUTES } from "@/constants/routes"
import { KEY } from "@/constants/key"
import { getUserById } from "@/services/user.service"
import { getProductBySlug } from "@/services/products.service"
import Axios from "axios"
import { notifications } from "@mantine/notifications"
import { ICreateUserInput } from "@/types/user.type"
import { ICreateStudentInput } from "@/types/student.type"
import { UserDetailsForm } from "@/pages/dashboard/user/page/UserDetailsForm"
import { StudentDetailsForm } from "@/pages/dashboard/user/page/StudentDetailsForm"

export const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => productId === "create", [productId])
  const isUpdate = useMemo(() => !!productId && productId !== "create", [productId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.BASE)
  }

  const { data: product, isLoading } = useQuery({
    queryKey: [KEY.PRODUCT, productId],
    queryFn: () => getProductBySlug(productId ?? ""),
    enabled: isUpdate,
  })

  const handleOnSubmit = async () => {}

  const isFormSubmitting = useMemo(() => {
    return false
  }, [])

  return (
    <Card>
      <Card.Section px={16} pt={16}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>{isCreate ? "Create" : "Edit"} User</Title>

            <Text c="dimmed">
              {isCreate ? "Create a new product" : "Modify existing product information."}
            </Text>
          </div>

          <div className="flex gap-2">
            <Button variant="light" onClick={() => handleOnCancel()} disabled={isFormSubmitting}>
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={() => handleOnSubmit()}
              loading={isFormSubmitting}
            >
              Save
            </Button>
          </div>
        </div>
      </Card.Section>

      <Card.Section p={16}>
        <Box pos="relative" mih={220}>
          FORM
        </Box>
      </Card.Section>
    </Card>
  )
}
