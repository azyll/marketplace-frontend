import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { deleteRole, getRoles, restoreRole } from "@/services/role.service"
import { IRole, IRoleFilters } from "@/types/role.type"
import {
  ActionIcon,
  Box,
  Card,
  Button,
  Space,
  Tooltip,
  Modal,
  Title,
  Text,
  Badge,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import {
  IconArchive,
  IconEdit,
  IconMoodSad,
  IconRestore,
  IconShieldPlus,
} from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Axios, { AxiosError } from "axios"
import dayjs from "dayjs"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useState } from "react"
import { useNavigate } from "react-router"
import { RoleFilter } from "./RoleFilter"

export const RoleList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IRoleFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: roles, isLoading } = useQuery({
    queryKey: [KEY.ROLES, filters],
    queryFn: () => getRoles(filters),
  })
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectRole, setSelectRole] = useState<{ role: IRole; type: "restore" | "archived" }>()
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (roleId: string) => {
      await deleteRole(roleId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Archive Success",
        message: "Successfully archive role",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.ROLES] })
      setSelectRole(undefined)
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
    mutationFn: (roleId: string) => restoreRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.ROLES] })

      notifications.show({
        title: "Restore Success",
        message: "Successfully Restore Department",
        color: "green",
      })

      close()
      setSelectRole(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      notifications.show({
        title: "Restore Failed",
        message: error?.response?.data?.error ?? "Can't Restore Department",
        color: "red",
      })
    },
  })
  const handleOnCreateRole = () => {
    navigate(ROUTES.DASHBOARD.ROLES.ID.replace(":roleId", "create"))
  }

  const handleOnDeleteRole = (roleId: string) => {
    const role = roles?.data?.find(({ id }) => id === roleId)

    if (role) {
      setSelectRole({ role, type: "archived" })
      open()
    }
  }
  const handleOnRestoreRole = (roleId: string) => {
    const role = roles?.data?.find(({ id }) => id === roleId)

    if (role) {
      setSelectRole({ role, type: "restore" })
      open()
    }
  }
  const handleOnCancelDeleteRole = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectRole(undefined)
    }, 200)
  }
  const handleOnCancelRestoreRole = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectRole(undefined)
    }, 200)
  }
  const handleOnEditRole = (roleId: string) => {
    navigate(ROUTES.DASHBOARD.ROLES.ID.replace(":roleId", roleId))
  }
  const columns: DataTableColumn<IRole>[] = [
    {
      accessor: "name",
      title: "Name",
    },
    {
      accessor: "systemTag",
      title: "System Tag",
      render: ({ systemTag }) => systemTag.toUpperCase(),
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
            <Tooltip label="Restore Department">
              <ActionIcon
                size="lg"
                color="green"
                variant="light"
                onClick={() => handleOnRestoreRole(id)}
              >
                <IconRestore size={14} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
              <ActionIcon size="lg" variant="light" onClick={() => handleOnEditRole(id)}>
                <IconEdit size={14} />
              </ActionIcon>
              <Tooltip label="Archive Role">
                <ActionIcon
                  size="lg"
                  color="red"
                  variant="light"
                  onClick={() => handleOnDeleteRole(id)}
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
      {selectRole?.type === "archived" ? (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteRole()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Role
          </Title>

          <Text fz={14}>
            Are you sure you want to archive <b>{selectRole?.role.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelDeleteRole()}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(selectRole?.role.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelRestoreRole()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore Program
          </Title>

          <Text fz={14}>
            Are you sure you want to restore <b>{selectRole?.role.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelRestoreRole()}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectRole?.role?.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}
      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Roles</h1>
          <div className="flex">
            <Button onClick={() => handleOnCreateRole()}>
              <IconShieldPlus size={14} /> <Space w={6} /> Create Role
            </Button>
          </div>
        </div>
        <RoleFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>
      <Space h={16} />
      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={roles?.data ?? []}
          // State
          fetching={isLoading}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No roles found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={roles?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
