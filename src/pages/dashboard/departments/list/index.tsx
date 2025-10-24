import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { deleteDepartment, getDepartments, restoreDepartment } from "@/services/department.service"
import { getRoles } from "@/services/role.service"
import { IDepartment, IGetDepartmentFilters } from "@/types/department.type"
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
  IconLibraryPlus,
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
import { DepartmentFilter } from "./DepartmentFilter"

export const DepartmentList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IGetDepartmentFilters>({
    all: true,
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })
  const { data: departments, isLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS, filters],
    queryFn: () => getDepartments(filters),
  })

  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedDepartment, setSelectDepartment] = useState<{
    department: IDepartment
    type: "archive" | "restore"
  }>()
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      await deleteDepartment(departmentId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Archive Success",
        message: "Successfully archive department",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS] })
      setSelectDepartment(undefined)
    },
    onError: (error) => {
      if (Axios.isAxiosError(error)) {
        error.response?.data.error?.[0]?.message

        notifications.show({
          title: "Archive Failed",
          message: error.response?.data.error?.[0]?.message,
          color: "red",
        })
      }
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (departmentId: string) => restoreDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS] })

      notifications.show({
        title: "Restore Success",
        message: "Successfully Restore Department",
        color: "green",
      })

      close()
      setSelectDepartment(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      notifications.show({
        title: "Restore Failed",
        message: error?.response?.data?.error ?? "Can't Restore Department",
        color: "red",
      })
    },
  })
  const handleOnCreateDepartment = () => {
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.ID.replace(":departmentId", "create"))
  }

  const handleOnDeleteDepartment = (departmentId: string) => {
    const department = departments?.data?.find(({ id }) => id === departmentId)

    if (department) {
      setSelectDepartment({ department, type: "archive" })
      open()
    }
  }
  const handleOnRestoreDepartment = (departmentId: string) => {
    const department = departments?.data?.find(({ id }) => id === departmentId)

    if (department) {
      setSelectDepartment({ department, type: "restore" })
      open()
    }
  }
  const handleOnCancelDeleteDepartment = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectDepartment(undefined)
    }, 200)
  }
  const handleOnCancelRestoreDepartment = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectDepartment(undefined)
    }, 200)
  }
  const handleOnEditDepartment = (departmentId: string) => {
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.ID.replace(":departmentId", departmentId))
  }
  const columns: DataTableColumn<IDepartment>[] = [
    {
      accessor: "name",
      title: "Name",
    },
    {
      accessor: "acronym",
      title: "Acronym",
      render: ({ acronym }) => `${acronym.toUpperCase()}`,
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
      textAlign: "center",
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
                onClick={() => handleOnRestoreDepartment(id)}
              >
                <IconRestore size={14} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
              <ActionIcon size="lg" variant="light" onClick={() => handleOnEditDepartment(id)}>
                <IconEdit size={14} />
              </ActionIcon>
              <Tooltip label="Archive Department ">
                <ActionIcon
                  size="lg"
                  color="red"
                  variant="light"
                  onClick={() => handleOnDeleteDepartment(id)}
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
      {selectedDepartment?.type == "archive" ? (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteDepartment()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Department
          </Title>

          <Text fz={14}>
            Are you sure you want to archive <b>{selectedDepartment.department?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelDeleteDepartment()}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(selectedDepartment.department?.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelRestoreDepartment()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore Program
          </Title>

          <Text fz={14}>
            Are you sure you want to restore <b>{selectedDepartment?.department?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelRestoreDepartment()}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectedDepartment?.department.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}
      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Department</h1>
          <div className="flex">
            <Button onClick={() => handleOnCreateDepartment()}>
              <IconLibraryPlus size={14} /> <Space w={6} /> Create Department
            </Button>
          </div>
        </div>
        <DepartmentFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>
      <Space h={16} />
      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={departments?.data ?? []}
          // State
          fetching={isLoading}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No departments found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={departments?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
