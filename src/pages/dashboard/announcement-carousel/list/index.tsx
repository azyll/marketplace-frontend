import { getImage } from "@/services/media.service"
import { getAnnouncements, deleteAnnouncement } from "@/services/announcement.service"
import { Card, Image, ActionIcon, Group, Text, Loader, Center, Button, Space } from "@mantine/core"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { IconTrash, IconEye, IconPhotoPlus } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import { useState } from "react"
import { IAnnouncement } from "@/types/announcement.type"
import { AxiosError } from "axios"
import { notifyResponseError } from "@/helper/errorNotification"

import { formatDate } from "@/helper/formatDate"

export function AnnouncementCarouselList() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Fetch announcements
  const { data, isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  })

  const announcements: IAnnouncement[] = data?.data ?? []

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] })
      notifications.show({
        title: "Success",
        message: response.message || "Announcement deleted successfully",
        color: "green",
      })
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Announcement Carousel", "delete")
    },
  })

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate(id)
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
            onClick={() => window.open(getImage(record.image || ""), "_blank")}
          >
            <IconEye size={16} />
          </ActionIcon>

          <ActionIcon
            size="lg"
            variant="light"
            color="red"
            onClick={() => handleDelete(record.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Loader size="xs" /> : <IconTrash size={16} />}
          </ActionIcon>
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
      <Card.Section px={24} py={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Announcement Carousels</h1>

          <Button onClick={() => {}}>
            <IconPhotoPlus size={14} />
            <Space w={6} /> Add Image
          </Button>
        </div>
      </Card.Section>

      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={announcements}
          // State
          fetching={isLoading}
          totalRecords={announcements.length}
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
