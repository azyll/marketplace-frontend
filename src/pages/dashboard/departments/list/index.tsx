import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { deleteDepartment, getDepartments } from "@/services/department.service"
import { getRoles } from "@/services/role.service"
import { IDepartment, IGetDepartmentFilters } from "@/types/department.type"
import { IRole, IRoleFilters } from "@/types/role.type"
import { ActionIcon, Box, Card, Button, Space, Tooltip, Modal, Title, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import {
  IconArchive,
  IconEdit,
  IconLibraryPlus,
  IconMoodSad,
  IconShieldPlus,
} from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Axios from "axios"
import dayjs from "dayjs"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useState } from "react"
import { useNavigate } from "react-router"
import { DepartmentFilter } from "./DepartmentFilter"

export const DepartmentList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IGetDepartmentFilters>({
    all: "true",
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })
  const { data: departments, isLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS, filters],
    queryFn: () => getDepartments(filters),
  })

  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [departmentForDeletion, setDepartmentForDeletion] = useState<IDepartment>()
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      await deleteDepartment(departmentId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Delete Success",
        message: "Successfully archive department",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.PRODUCT_DEPARTMENTS] })
      setDepartmentForDeletion(undefined)
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
  const handleOnCreateDepartment = () => {
    navigate(ROUTES.DASHBOARD.DEPARTMENTS.ID.replace(":departmentId", "create"))
  }

  const handleOnDeleteDepartment = (departmentId: string) => {
    const department = departments?.data?.find(({ id }) => id === departmentId)

    if (department) {
      setDepartmentForDeletion(department)
      open()
    }
  }
  const handleOnCancelDeleteDepartment = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setDepartmentForDeletion(undefined)
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
      render: ({ deletedAt }) =>
        deletedAt ? dayjs(deletedAt).format("MMM D, YYYY h:mm A") : "Active",
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id }) => (
        <div className="flex justify-center gap-4">
          <ActionIcon size="lg" variant="light" onClick={() => handleOnEditDepartment(id)}>
            <IconEdit size={14} />
          </ActionIcon>

          <Tooltip label="Archive Department">
            <ActionIcon
              size="lg"
              color="red"
              variant="light"
              onClick={() => handleOnDeleteDepartment(id)}
            >
              <IconArchive size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
      ),
    },
  ]
  return (
    <Card>
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
          Are you sure you want to archive <b>{departmentForDeletion?.name}</b>?
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
            onClick={() => deleteMutation.mutate(departmentForDeletion?.id ?? "")}
          >
            Archive
          </Button>
        </div>
      </Modal>
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
