import { AuthContext } from "@/contexts/AuthContext"
import { Space, Text, Title } from "@mantine/core"
import { useContext } from "react"

export default function Profile() {
  const user = useContext(AuthContext)

  return (
    <div className="max-w-page-width page-x-padding mx-auto mt-4">
      <div>
        <Title size="h3">User Details</Title>
        <Space h={12} />
        <div className="space-y-3">
          <Text size="sm" fw={500} c="dimmed">
            Full Name
          </Text>
          <Text>{user.user?.fullName || "Not provided"}</Text>
        </div>
      </div>

      <Space h={24} />

      {user.user?.student ? (
        <div>
          <Title size="h3">Student Details</Title>

          <Space h={12} />

          <div className="space-y-3">
            <div>
              <Text size="sm" fw={500} c="dimmed">
                Student ID
              </Text>

              <Text>0{user.user.student.id || "Not provided"}</Text>
            </div>

            <div>
              <Text size="sm" fw={500} c="dimmed">
                Program
              </Text>

              <Text>{user.user.student.program?.name || "Not assigned"}</Text>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
