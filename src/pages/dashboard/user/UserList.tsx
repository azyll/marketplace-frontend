import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getUsers } from "@/services/user.service"
import { useFilters } from "@/hooks/useFilters"
import { IGetUserFilter, IUser } from "@/types/user.type"
import { ActionIcon, Box, Button, Card, LoadingOverlay, Pagination, Table } from "@mantine/core"
import dayjs from "dayjs"
import { IconEdit, IconMoodSad, IconPlus, IconTrashX } from "@tabler/icons-react"
import { useMemo } from "react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

export const UserList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters] = useFilters<IGetUserFilter>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: users, isLoading } = useQuery({
    queryKey: [KEY.USERS, filters],
    queryFn: () => getUsers(filters),
  })

  const navigate = useNavigate()

  const handleOnCreateUser = () => {
    navigate(ROUTES.DASHBOARD.USER.ID.replace(":userId", "create"))
  }

  const handleOnEditUser = (userId: string) => {}

  const handleOnDeleteUser = (userId: string) => {}

  const columns: DataTableColumn<IUser>[] = [
    {
      accessor: "fullName",
      title: "Name",
    },
    {
      accessor: "email",
      title: "Email",
    },
    {
      accessor: "role.name",
      title: "Role",
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      accessor: "createdAt",
      title: "Created At",

      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      // Required yung 'accessor' kaya nilagyan ko nalang ng value kahit wala sa IUser na type
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id }) => (
        <div className="flex justify-center gap-4">
          <ActionIcon size="lg" variant="light" onClick={() => handleOnEditUser(id)}>
            <IconEdit size={14} />
          </ActionIcon>

          <ActionIcon size="lg" color="red" variant="light" onClick={() => handleOnDeleteUser(id)}>
            <IconTrashX size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <Card.Section px={16} pt={16}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Users</h1>

          <Button onClick={() => handleOnCreateUser()}>
            <IconPlus size={14} /> Create User
          </Button>
        </div>
      </Card.Section>

      <Card.Section p={16}>
        <DataTable
          columns={columns}
          records={users?.data ?? []}
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No users found"
          fetching={isLoading}
          totalRecords={users?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
