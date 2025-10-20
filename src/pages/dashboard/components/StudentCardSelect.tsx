import { IconCheck, IconCopy, IconEdit, IconPlus, IconUser } from "@tabler/icons-react"
import { ActionIcon, Badge, Button, Card, Space, Text, Title } from "@mantine/core"

export interface StudentCardSelectProps {
  student?: {
    firstName?: string
    lastName?: string
    program?: string
    id?: string
  }
  isLoading?: boolean
  onSelect?: () => void
  existing?: boolean
  onEdit?: () => void
}

export const StudentCardSelect = ({
  student,
  onSelect,
  existing,
  onEdit,
}: StudentCardSelectProps) => {
  if (!student) {
    return (
      <Card radius="md" p={18}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="aspect-square rounded-full bg-[#f2f5f9]/75 p-2">
              <IconUser size={20} />
            </div>

            <ActionIcon
              color={"blue"}
              variant="light"
              radius="xl"
              size="lg"
              onClick={() => onEdit?.()}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </div>

          <div className="rounded-md border border-dashed border-gray-200 py-4">
            <p className="text-center text-sm text-neutral-400">No Student Selected</p>
          </div>
        </div>
      </Card>
    )
  }

  const fullName = student.firstName + " " + student.lastName

  return (
    <Card radius="md" p={18}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="aspect-square rounded-full bg-[#f2f5f9]/75 p-2">
            <IconUser size={20} />
          </div>

          <ActionIcon
            color={"blue"}
            variant="light"
            radius="xl"
            size="lg"
            onClick={() => onEdit?.()}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </div>

        <div>
          <Badge color={existing ? "green" : "blue"} size="sm">
            {existing ? "Existing" : "New"}
          </Badge>
          <span className="flex items-center space-x-2">
            <p className="text-lg font-semibold">{fullName}</p>
          </span>
          <p className="text-sm text-neutral-500">{student?.id}</p>
        </div>
      </div>
    </Card>
  )
}
