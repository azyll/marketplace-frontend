import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { deleteUser, getUsers, restoreUser } from "@/services/user.service"
import { useFilters } from "@/hooks/useFilters"
import { IGetUserFilter, IUser, IUserFilters } from "@/types/user.type"
import {
  ActionIcon,
  Badge,
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
import {
  IconArchive,
  IconEdit,
  IconFileTypeXls,
  IconMoodSad,
  IconPlus,
  IconRestore,
} from "@tabler/icons-react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@mantine/hooks"
import { useContext, useState } from "react"
import { notifications } from "@mantine/notifications"
import Axios, { AxiosError } from "axios"
import { bulkCreateStudent } from "@/services/student.service"
import { UsersFilter } from "./UsersFilter"
import { notifyResponseError } from "@/helper/errorNotification"
import { AuthContext } from "@/contexts/AuthContext"

export const UserList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IUserFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { user: currentUser } = useContext(AuthContext)
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

  const [opened, { open, close }] = useDisclosure(false)

  const [selectUser, setSelectUser] = useState<{ user: IUser; type: "archive" | "restore" }>()

  const handleOnDeleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      notifications.show({
        title: "You cannot archive yourself",
        message: "You are not allowed to archive yourself",
        color: "red",
      })
      return
    }
    const user = users?.data?.find(({ id }) => id === userId)

    if (user) {
      setSelectUser({ type: "archive", user })
      open()
    }
  }
  const handleOnRestoreUser = (userId: string) => {
    const user = users?.data?.find(({ id }) => id === userId)

    if (user) {
      setSelectUser({ type: "restore", user })
      open()
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await deleteUser(userId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Archive Success",
        message: "Successfully Archived User",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.USERS] })
      setSelectUser(undefined)
    },
    onError: (error) => {
      if (Axios.isAxiosError(error)) {
        notifications.show({
          title: "Archive Failed",
          message: error.response?.data.error?.[0]?.message || error.response?.data.error,
          color: "red",
        })
      }
    },
  })
  const restoreMutation = useMutation({
    mutationFn: (userId: string) => restoreUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.USERS] })

      notifications.show({
        title: "Restore Success",
        message: "Successfully Restore User",
        color: "green",
      })

      close()
      setSelectUser(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      notifications.show({
        title: "Restore Failed",
        message: error?.response?.data?.error ?? "Can't Restore User",
        color: "red",
      })
    },
  })

  const handleOnCancelDeleteUser = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectUser(undefined)
    }, 200)
  }
  const handleOnCancelRestoreUser = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectUser(undefined)
    }, 200)
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
      accessor: "deletedAt",
      title: "Status",
      render: ({ deletedAt }) => (
        <Badge color={deletedAt ? "gray" : "green"} variant="light">
          {deletedAt ? "Archived" : "Active"}
        </Badge>
      ),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id, deletedAt }) => (
        <div className="flex justify-center gap-4">
          {deletedAt ? (
            <Tooltip label="Restore User">
              <ActionIcon
                size="lg"
                color="green"
                variant="light"
                onClick={() => handleOnRestoreUser(id)}
              >
                <IconRestore size={14} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
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
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card>
      {selectUser?.type == "archive" ? (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteUser()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive User
          </Title>

          <Text fz={14}>
            Are you sure you want to archive <b>{selectUser?.user?.fullName}</b>?
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
              onClick={() => deleteMutation.mutate(selectUser?.user.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelRestoreUser()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore User
          </Title>

          <Text fz={14}>
            Are you sure you want to restore <b>{selectUser?.user?.fullName}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelRestoreUser()}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectUser?.user.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}

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
