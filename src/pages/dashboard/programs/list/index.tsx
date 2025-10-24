import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { deleteProgram, getPrograms, restoreProgram } from "@/services/program.service"
import { IGetProgramsFilters, IProgram } from "@/types/program.type"
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
import {
  IconArchive,
  IconBookUpload,
  IconEdit,
  IconMoodSad,
  IconRestore,
} from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"
import { ProgramFilter } from "./ProgramFilter"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { notifications } from "@mantine/notifications"
import Axios, { AxiosError } from "axios"

export const ProgramList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IGetProgramsFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    all: true,
  })

  const { data: programs, isLoading } = useQuery({
    queryKey: [KEY.PROGRAMS, filters],
    queryFn: () => getPrograms(filters),
  })

  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedProgram, setSelectedProgram] = useState<{
    program: IProgram
    type: "restore" | "archived"
  }>()

  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (programId: string) => {
      await deleteProgram(programId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Archive Success",
        message: "Successfully archive program",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.PROGRAMS] })
      setSelectedProgram(undefined)
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
    mutationFn: (programId: string) => restoreProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PROGRAMS] })

      notifications.show({
        title: "Restore Success",
        message: "Successfully Restore Program",
        color: "green",
      })

      close()
      setSelectedProgram(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      notifications.show({
        title: "Restore Failed",
        message: error?.response?.data?.error ?? "Can't Restore Program",
        color: "red",
      })
    },
  })
  const handleOnCreateProgram = () => {
    navigate(ROUTES.DASHBOARD.PROGRAMS.ID.replace(":programId", "create"))
  }

  const handleOnDeleteProgram = (programId: string) => {
    const program = programs?.data?.find(({ id }) => id === programId)

    if (program) {
      setSelectedProgram({ program, type: "archived" })
      open()
    }
  }
  const handleOnRestoreProgram = (programId: string) => {
    const program = programs?.data?.find(({ id }) => id === programId)

    if (program) {
      setSelectedProgram({ program, type: "restore" })
      open()
    }
  }
  const handleOnCancelDeleteProgram = () => {
    if (deleteMutation.isPending || restoreMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectedProgram(undefined)
    }, 200)
  }
  const handleOnCancelRestoreProgram = () => {
    if (deleteMutation.isPending || restoreMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectedProgram(undefined)
    }, 200)
  }
  const handleOnEditProgram = (programId: string) => {
    navigate(ROUTES.DASHBOARD.PROGRAMS.ID.replace(":programId", programId))
  }
  const columns: DataTableColumn<IProgram>[] = [
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
      accessor: "department.acronym",
      title: "Department",
      render: ({ department }) => `${department.acronym.toUpperCase()}`,
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
            <Tooltip label="Restore Program">
              <ActionIcon
                size="lg"
                color="green"
                variant="light"
                onClick={() => handleOnRestoreProgram(id)}
              >
                <IconRestore size={14} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
              <ActionIcon size="lg" variant="light" onClick={() => handleOnEditProgram(id)}>
                <IconEdit size={14} />
              </ActionIcon>
              <Tooltip label="Archive Program">
                <ActionIcon
                  size="lg"
                  color="red"
                  variant="light"
                  onClick={() => handleOnDeleteProgram(id)}
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
      {selectedProgram?.type == "archived" ? (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteProgram()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Program
          </Title>

          <Text fz={14}>
            Are you sure you want to archive <b>{selectedProgram?.program?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelDeleteProgram()}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(selectedProgram?.program?.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelRestoreProgram()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore Program
          </Title>

          <Text fz={14}>
            Are you sure you want to restore <b>{selectedProgram?.program?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelRestoreProgram()}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectedProgram?.program.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}

      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Program</h1>
          <div className="flex">
            <Button onClick={() => handleOnCreateProgram()}>
              <IconBookUpload size={14} /> <Space w={6} /> Create Program
            </Button>
          </div>
        </div>
        <ProgramFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>
      <Space h={16} />
      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={programs?.data ?? []}
          // State
          fetching={isLoading}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No program found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={programs?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
