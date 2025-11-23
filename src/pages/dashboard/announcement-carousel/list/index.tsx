import { getImage } from "@/services/media.service"
import {
  getAnnouncements,
  deleteAnnouncement,
  restoreArchivedAnnouncement,
} from "@/services/announcement.service"
import {
  Card,
  Image,
  ActionIcon,
  Text,
  Center,
  Button,
  Space,
  Modal,
  Title,
  Tooltip,
  Badge,
} from "@mantine/core"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { IconPhotoPlus, IconRestore, IconArchive, IconEdit } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { useState } from "react"
import { IAnnouncement } from "@/types/announcement.type"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"
import { formatDate } from "@/helper/formatDate"
import { useDisclosure } from "@mantine/hooks"
import { AnnouncementFilter } from "./AnnouncementFilter"
import { KEY } from "@/constants/key"
import { getLoggedInUser } from "@/services/user.service"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

interface IAnnouncementFilters {
  search?: string
  status?: "active" | "archived"
  page?: number
  limit?: number
}

export function AnnouncementCarouselList() {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<IAnnouncementFilters>({
    status: undefined,
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })
  const navigate = useNavigate()
  const { data: user, isLoading: iseGettingUser } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })
  const modulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "announcement-carousel",
  )
  const haveEditPermission =
    user?.role.systemTag === "admin" || modulePermission?.permission === "edit"

  if (!modulePermission && user?.role.systemTag === "employee") {
    navigate(ROUTES.DASHBOARD.HOME, {
      replace: true,
    })
  }
  const [actionModalOpened, { open: openActionModal, close: closeActionModal }] =
    useDisclosure(false)

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{
    announcement: IAnnouncement
    type: "archive" | "restore"
  }>()

  const { data, isLoading, error } = useQuery({
    queryKey: [KEY.ANNOUNCEMENTS, filters],
    queryFn: () =>
      getAnnouncements({
        all: true,
        status: filters.status,
        search: filters?.search,
        limit: filters.limit,
        page: filters.page,
      }),
  })

  const announcements: IAnnouncement[] = data?.data ?? []
  const totalRecords = data?.meta?.totalItems ?? 0

  // Delete/Archive mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [KEY.ANNOUNCEMENTS] })
      notifications.show({
        title: "Archive Success",
        message: response.message || "Announcement archived successfully",
        color: "green",
      })
      closeActionModal()
      setSelectedAnnouncement(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Announcement Carousel", "delete")
    },
  })

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: restoreArchivedAnnouncement,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [KEY.ANNOUNCEMENTS] })
      notifications.show({
        title: "Restore Success",
        message: response.message || "Announcement restored successfully",
        color: "green",
      })
      closeActionModal()
      setSelectedAnnouncement(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Announcement Carousel", "update")
    },
  })

  const handleOnArchive = (id: string) => {
    const announcement = announcements.find((a) => a.id === id)
    if (announcement) {
      setSelectedAnnouncement({ announcement, type: "archive" })
      openActionModal()
    }
  }

  const handleOnRestore = (id: string) => {
    const announcement = announcements.find((a) => a.id === id)
    if (announcement) {
      setSelectedAnnouncement({ announcement, type: "restore" })
      openActionModal()
    }
  }

  const handleOnCancelAction = () => {
    if (deleteMutation.isPending || restoreMutation.isPending) return
    closeActionModal()
    setTimeout(() => {
      setSelectedAnnouncement(undefined)
    }, 200)
  }

  const handleOnEditAnnouncement = (announcementId: string) => {
    navigate(ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.ID.replace(":announcementId", announcementId))
  }
  const handleOnCreateAnnouncement = () => {
    navigate(ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.ID.replace(":announcementId", "create"))
  }
  console.log(filters)
  const handleOnFilter = (newFilters: Partial<IAnnouncementFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const columns: DataTableColumn<IAnnouncement>[] = [
    {
      accessor: "image",
      title: "Preview",
      width: 150,
      render: (record) =>
        record.image == null || record.image == "" ? (
          <a href={getImage("carousel/default-image.png")} target="_blank">
            <Image
              src={getImage("carousel/default-image.png")}
              alt="Announcement"
              height={60}
              width={100}
              fit="cover"
              radius="sm"
            />
          </a>
        ) : (
          <a href={getImage(record.image)} target="_blank">
            <Image
              src={getImage(record.image)}
              alt="Announcement"
              height={60}
              width={100}
              fit="cover"
              radius="sm"
            />
          </a>
        ),
    },
    {
      accessor: "title",
      title: "Title",
    },
    {
      accessor: "message",
      title: "Message",
      width: 120,
    },
    {
      accessor: "product.name",
      title: "Product Name",
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: (record) => (record.createdAt ? formatDate(record.createdAt) : "-"),
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
      render: (record) => (
        <div className="flex justify-center gap-4">
          {record.deletedAt ? (
            <Tooltip label="Restore Announcement">
              <ActionIcon
                size="lg"
                color="green"
                variant="light"
                onClick={() => handleOnRestore(record.id)}
              >
                <IconRestore size={16} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <>
              <ActionIcon
                size="lg"
                variant="light"
                color="blue"
                onClick={() => handleOnEditAnnouncement(record.id)}
              >
                <IconEdit size={16} />
              </ActionIcon>
              <Tooltip label="Archive Announcement">
                <ActionIcon
                  size="lg"
                  variant="light"
                  color="red"
                  onClick={() => handleOnArchive(record.id)}
                >
                  <IconArchive size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ]

  if (!haveEditPermission) {
    columns.pop()
  }

  if (error) {
    return (
      <Card>
        <Center py={40}>
          <Text c="red">Failed to load announcements</Text>
        </Center>
      </Card>
    )
  }

  return (
    <Card>
      {/* Archive/Restore Confirmation Modal */}
      {selectedAnnouncement?.type === "archive" ? (
        <Modal
          opened={actionModalOpened}
          onClose={handleOnCancelAction}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Announcement
          </Title>

          <Text fz={14}>Are you sure you want to archive this announcement image?</Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={handleOnCancelAction}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(selectedAnnouncement?.announcement?.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={actionModalOpened}
          onClose={handleOnCancelAction}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore Announcement
          </Title>

          <Text fz={14}>Are you sure you want to restore this announcement image?</Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={handleOnCancelAction}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectedAnnouncement?.announcement?.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}

      <Card.Section px={24} py={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Announcement Images</h1>

          {haveEditPermission ? (
            <Button onClick={handleOnCreateAnnouncement}>
              <IconPhotoPlus size={14} /> <Space w={6} /> Add Carousel Image
            </Button>
          ) : null}
        </div>

        <AnnouncementFilter filters={filters} onFilter={handleOnFilter} />
      </Card.Section>

      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={announcements}
          // State
          fetching={isLoading || iseGettingUser}
          noRecordsText="No announcements found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={340}
          // Pagination
          totalRecords={totalRecords}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => handleOnFilter({ page: p })}
        />
      </Card.Section>
    </Card>
  )
}
