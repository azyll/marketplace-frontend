import { getImage } from "@/services/media.service"
import {
  getAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  restoreArchivedAnnouncement,
  getArchivedAnnouncements,
} from "@/services/announcement.service"
import {
  Card,
  Image,
  ActionIcon,
  Group,
  Text,
  Loader,
  Center,
  Button,
  Space,
  Modal,
  Title,
  Tooltip,
} from "@mantine/core"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { IconTrash, IconEye, IconPhotoPlus, IconRestore, IconArchive } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { useState, useMemo } from "react"
import { IAnnouncement } from "@/types/announcement.type"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"
import { formatDate } from "@/helper/formatDate"
import { ImageUpload } from "@/components/ImageUpload"
import { useDisclosure } from "@mantine/hooks"
import { AnnouncementFilter } from "./AnnouncementFilter"

interface IAnnouncementFilters {
  status?: "active" | "archived" | null
  page?: number
  limit?: number
}

export function AnnouncementCarouselList() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [filters, setFilters] = useState<IAnnouncementFilters>({
    status: null,
    page: 1,
    limit: 10,
  })

  const [uploadModalOpened, { open: openUploadModal, close: closeUploadModal }] =
    useDisclosure(false)
  const [actionModalOpened, { open: openActionModal, close: closeActionModal }] =
    useDisclosure(false)
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{
    announcement: IAnnouncement
    type: "archive" | "restore"
  }>()
  const [viewingImage, setViewingImage] = useState<string>("")

  const showArchived = filters.status === "archived"

  const { data, isLoading, error } = useQuery({
    queryKey: ["announcements", showArchived],
    queryFn: showArchived ? getArchivedAnnouncements : getAnnouncements,
  })

  const announcements: IAnnouncement[] = data?.data ?? []

  // Filter announcements based on status
  const filteredAnnouncements = useMemo(() => {
    if (!filters.status) return announcements

    if (filters.status === "active") {
      return announcements.filter((a) => !a.deletedAt)
    } else if (filters.status === "archived") {
      return announcements.filter((a) => a.deletedAt)
    }

    return announcements
  }, [announcements, filters.status])

  // Delete/Archive mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
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
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
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

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
      notifications.show({
        title: "Upload Success",
        message: response.message || "Announcement image uploaded successfully",
        color: "green",
      })
      closeUploadModal()
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Announcement Carousel", "create")
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

  const handleOnImageUpload = async (files: File[]) => {
    if (files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append("image", file)

    uploadMutation.mutate(formData as any)
  }

  const handleViewImage = (imageUrl: string) => {
    setViewingImage(imageUrl)
    openImageModal()
  }

  const handleOnFilter = (newFilters: Partial<IAnnouncementFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    if (newFilters.page) {
      setPage(newFilters.page)
    }
  }

  const columns: DataTableColumn<IAnnouncement>[] = [
    {
      accessor: "image",
      title: "Preview",
      width: 150,
      render: (record) => (
        <Image
          src={getImage(record.image)}
          alt="Announcement"
          height={60}
          width={100}
          fit="cover"
          radius="sm"
        />
      ),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: (record) => (record.createdAt ? formatDate(record.createdAt) : "-"),
    },
    {
      accessor: "deletedAt",
      title: "Status",
      render: ({ deletedAt }) => (deletedAt ? "Archived" : "Active"),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: (record) => (
        <div className="flex justify-center gap-4">
          <ActionIcon
            size="lg"
            variant="light"
            color="blue"
            onClick={() => handleViewImage(getImage(record.image || ""))}
          >
            <IconEye size={16} />
          </ActionIcon>

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
          )}
        </div>
      ),
    },
  ]

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
      {/* Image Preview Modal */}
      <Modal
        opened={imageModalOpened}
        onClose={closeImageModal}
        centered
        size="xl"
        withCloseButton
        title="Announcement Image"
      >
        <Image src={viewingImage} alt="Announcement Preview" fit="contain" radius="md" />
      </Modal>

      {/* Upload Modal */}
      <Modal
        opened={uploadModalOpened}
        onClose={closeUploadModal}
        centered
        withCloseButton={false}
        size="xl"
        closeOnClickOutside={!uploadMutation.isPending}
      >
        <Title order={5} mb={16}>
          Upload Announcement Image
        </Title>
        <ImageUpload maxFiles={1} multiple={false} onDrop={handleOnImageUpload} />
        {uploadMutation.isPending && (
          <Center mt={16}>
            <Loader size="sm" />
            <Text ml={8} size="sm">
              Uploading...
            </Text>
          </Center>
        )}
      </Modal>

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

          <Button onClick={openUploadModal}>
            <IconPhotoPlus size={14} /> <Space w={6} /> Add Image
          </Button>
        </div>

        <AnnouncementFilter filters={filters} onFilter={handleOnFilter} />
      </Card.Section>

      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={filteredAnnouncements}
          // State
          fetching={isLoading}
          totalRecords={filteredAnnouncements.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={setPage}
          noRecordsText="No announcements found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={340}
        />
      </Card.Section>
    </Card>
  )
}
