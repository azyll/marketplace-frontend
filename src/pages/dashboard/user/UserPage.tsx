import { useNavigate, useParams } from "react-router"
import { useMemo } from "react"
import { Button, Card } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { ROUTES } from "@/constants/routes"

export const UserPage = () => {
  const { userId } = useParams<{ userId: string }>()

  const navigate = useNavigate()

  const isCreate = useMemo(() => userId === "create", [userId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.USER.BASE)
  }

  return (
    <Card>
      <Card.Section px={16} pt={16}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">{isCreate ? "Create" : "Edit"} User</h1>

          <div className="flex gap-2">
            <Button variant="light" onClick={() => handleOnCancel()}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </Card.Section>

      <Card.Section p={16}>Form</Card.Section>
    </Card>
  )
}
