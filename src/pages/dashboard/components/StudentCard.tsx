import { IconCheck, IconCopy, IconUser } from "@tabler/icons-react"
import { ActionIcon, Badge, Card, CopyButton, Skeleton, Tooltip } from "@mantine/core"
import { IStudent } from "@/types/user.type"

interface Props {
  student?: IStudent
  isLoading?: boolean
}

const StudentDetailsSkeleton = () => {
  return (
    <div>
      <Skeleton height={23} radius="sm" w={220} />
      <Skeleton height={16} mt={8} w={280} radius="sm" />
      <Skeleton height={16} mt={8} w={180} radius="sm" />
    </div>
  )
}

export const StudentCard = ({ student, isLoading }: Props) => {
  return (
    <Card radius="md" className="!bg-[#f2f5f9]/75" p={18}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="aspect-square rounded-full bg-white p-2">
            <IconUser />
          </div>

          {student && (
            <CopyButton value={student.id.toString()} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Student ID"} withArrow position="right">
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    size="lg"
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          )}
        </div>

        {isLoading ? (
          <StudentDetailsSkeleton />
        ) : (
          <div>
            <span className="flex items-center space-x-2">
              <p className="text-lg font-semibold">{student?.user.fullName}</p>
              <Badge variant="light">{student?.program.acronym}</Badge>
            </span>
            <p className="text-sm text-neutral-500">{student?.user.username}@fairview.sti.edu.ph</p>
            <p className="text-sm text-neutral-500">{student?.id}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
