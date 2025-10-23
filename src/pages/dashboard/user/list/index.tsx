import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { deleteUser, getUsers } from "@/services/user.service"
import { useFilters } from "@/hooks/useFilters"
import { IGetUserFilter, IUser, IUserFilters } from "@/types/user.type"
import {
  ActionIcon,
  Box,
  Button,
  Card,
  FileButton,
  Modal,
  Space,
  Text,
  Title,
  Tooltip,
} from "@mantine/core"
import dayjs from "dayjs"
import { IconArchive, IconEdit, IconFileTypeXls, IconMoodSad, IconPlus } from "@tabler/icons-react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { notifications } from "@mantine/notifications"
import Axios, { AxiosError } from "axios"
import { bulkCreateStudent } from "@/services/student.service"
import { UsersFilter } from "./UsersFilter"
import { notifyResponseError } from "@/helper/errorNotification"

export const UserList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IUserFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: users, isLoading } = useQuery({
    queryKey: [KEY.USERS, filters],
    queryFn: () => getUsers(filters),
  })

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const handleOnCreateUser = () => {
    navigate(ROUTES.DASHBOARD.USER.ID.replace(":userId", "create"))
  }

  const handleOnEditUser = (userId: string) => {
    navigate(ROUTES.DASHBOARD.USER.ID.replace(":userId", userId))
  }

  const bulkUploadMutation = useMutation({
    mutationFn: (file: File) => bulkCreateStudent(file),

    onSuccess: async (data) => {
      notifications.show({
        title: "Upload Successful",
        message: data?.message || "Students were uploaded successfully.",
        color: "green",
      })

      await queryClient.invalidateQueries({ queryKey: [KEY.USERS], exact: false })
    },

    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Students", "create")
    },
  })

  const handleOnBulkUploadStudent = (file: File) => {
    bulkUploadMutation.mutate(file)
  }

  const columns: DataTableColumn<IUser>[] = [
    {
      accessor: "fullName",
      title: "Name",
    },
    {
      accessor: "role.name",
      title: "Role",
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "-"),
    },
    {
      accessor: "createdAt",
      title: "Created At",

      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "-"),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id }) => (
        <div className="flex justify-center gap-4">
          <ActionIcon size="lg" variant="light" onClick={() => handleOnEditUser(id)}>
            <IconEdit size={14} />
          </ActionIcon>

          <Tooltip label="Archive User">
            <ActionIcon
              size="lg"
              color="red"
              variant="light"
              onClick={() => handleOnDeleteUser(id)}
            >
              <IconArchive size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
      ),
    },
  ]

  const [opened, { open, close }] = useDisclosure(false)

  const [userForDeletion, setUserForDeletion] = useState<IUser>()

  const handleOnDeleteUser = (userId: string) => {
    const user = users?.data?.find(({ id }) => id === userId)

    if (user) {
      setUserForDeletion(user)
      open()
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await deleteUser(userId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Delete Success",
        message: "Successfully Deleted User",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.USERS] })
      setUserForDeletion(undefined)
    },
    onError: (error) => {
      if (Axios.isAxiosError(error)) {
        error.response?.data.error?.[0]?.message

        notifications.show({
          title: "Delete Failed",
          message: error.response?.data.error?.[0]?.message,
          color: "red",
        })
      }
    },
  })

  const handleOnCancelDeleteUser = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setUserForDeletion(undefined)
    }, 200)
  }

  return (
    <Card>
      <Modal
        opened={opened}
        onClose={() => handleOnCancelDeleteUser()}
        withCloseButton={false}
        centered
        closeOnClickOutside={!deleteMutation.isPending}
      >
        <Title order={5} mb={4}>
          Delete User
        </Title>

        <Text fz={14}>
          Are you sure you want to delete <b>{userForDeletion?.fullName}</b>?
        </Text>

        <div className="mt-8 flex justify-end gap-2">
          <Button
            variant="light"
            color="black"
            onClick={() => handleOnCancelDeleteUser()}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            color="red"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(userForDeletion?.id ?? "")}
          >
            Delete
          </Button>
        </div>
      </Modal>

      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Users</h1>
          <div className="flex">
            <FileButton
              onChange={(file) => file && handleOnBulkUploadStudent(file)}
              accept=".xlsx,.xls"
            >
              {(props) => (
                <Button variant="light" {...props} loading={bulkUploadMutation.isPending}>
                  <IconFileTypeXls size={14} /> <Space w={6} />
                  Bulk Upload Students
                </Button>
              )}
            </FileButton>

            <Space w={10} />

            <Button onClick={() => handleOnCreateUser()}>
              <IconPlus size={14} /> <Space w={6} /> Create User
            </Button>
          </div>
        </div>
        <UsersFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>

      <Space h={16} />

      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={users?.data ?? []}
          // State
          fetching={isLoading || bulkUploadMutation.isPending}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No users found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={users?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
