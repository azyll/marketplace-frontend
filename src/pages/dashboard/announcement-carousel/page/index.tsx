import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import {
  createAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "@/services/announcement.service"
import {
  IAnnouncement,
  ICreateAnnouncementInput,
  IUpdateAnnouncementInput,
} from "@/types/announcement.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { AnnouncementDetailsForm, AnnouncementDetailsFormRef } from "./AnnouncementDetailsForm"
import { Button, Card, LoadingOverlay, Space, Text, Title } from "@mantine/core"
import { getImage } from "@/services/media.service"
import { notifications } from "@mantine/notifications"

export default function AnnouncementCarouselPage() {
  const { announcementId } = useParams<{ announcementId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isCreate = useMemo(() => announcementId === "create", [announcementId])
  const isUpdate = useMemo(() => !!announcementId && announcementId !== "create", [announcementId])

  const handleOnCancel = () => {
    navigate(ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.BASE)
  }

  const { data: announcement, isLoading } = useQuery({
    queryKey: [KEY.ANNOUNCEMENTS, announcementId],
    enabled: isUpdate,
    queryFn: () => getAnnouncementById(announcementId ?? ""),
  })
  const [imageDefaultValue, setImageDefaultValue] = useState<string>()

  const announcementFormRef = useRef<AnnouncementDetailsFormRef>(null)
  useEffect(() => {
    // Initialize default form values
    if (announcement) {
      announcementFormRef.current?.form.setInitialValues({
        title: announcement.title ?? "",
        message: announcement.message ?? "",
        productId: announcement?.productId ?? "",
      })
      setImageDefaultValue(getImage(announcement.image))
      announcementFormRef.current?.form.reset()
    }
  }, [announcement])
  console.log(announcement, announcementFormRef)
  const createAnnouncementMutation = useMutation({
    mutationFn: (payload: ICreateAnnouncementInput) => createAnnouncement(payload),
    onSuccess: () => {
      notifications.show({
        title: "Create Success",
        message: "Successfully Created Announcement",
        color: "green",
      })

      queryClient.invalidateQueries({ queryKey: [KEY.ANNOUNCEMENTS] })
      navigate(ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.BASE)
    },
  })

  const updateAnnouncementMutation = useMutation({
    mutationFn: async (data: { payload: IUpdateAnnouncementInput; announcementId: string }) =>
      await updateAnnouncement(data.announcementId, data.payload),
    onSuccess: async () => {
      notifications.show({
        title: "Update Success",
        message: "Successfully Updated Announcement",
        color: "green",
      })

      queryClient.invalidateQueries({ queryKey: [KEY.ANNOUNCEMENTS] })
      navigate(ROUTES.DASHBOARD.ANNOUNCEMENT_CAROUSEL.BASE)
    },
  })
  const isFormSubmitting = useMemo(
    () => createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending,
    [createAnnouncementMutation.isPending, updateAnnouncementMutation.isPending],
  )

  const handleOnSubmit = async () => {
    if (!announcementFormRef.current) return

    const { hasErrors } = announcementFormRef.current.form.validate()

    if (hasErrors) return

    const announcementData = announcementFormRef.current.form.getValues()

    if (isCreate) {
      createAnnouncementMutation.mutate(announcementData)
    } else if (isUpdate) {
      updateAnnouncementMutation.mutate({
        announcementId: announcement?.id ?? "",
        payload: announcementData,
      })
    }
  }
  const validateForms = () => {
    const announcementDetailsForm = announcementFormRef.current?.form

    if (!announcementDetailsForm) return

    const { hasErrors: announcementDetailsHasError } = announcementDetailsForm.validate()

    return announcementDetailsHasError
  }
  return (
    <div>
      <Card pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} />

        <Card.Section p={24}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Title order={3}>{isCreate ? "Create" : "Edit"} Announcement Carousel Image</Title>

              <Text c="dimmed">
                {isCreate ? "Create a announcement" : "Modify existing announcement information."}
              </Text>
            </div>

            <div className="flex gap-2">
              <Button variant="light" onClick={() => handleOnCancel()} disabled={isFormSubmitting}>
                Cancel
              </Button>

              <Button
                disabled={isLoading}
                loading={isFormSubmitting}
                onClick={() => handleOnSubmit()}
              >
                Save
              </Button>
            </div>
          </div>
        </Card.Section>

        <Card.Section p={24}>
          <AnnouncementDetailsForm
            ref={announcementFormRef}
            imageDefaultValue={imageDefaultValue}
            announcement={announcement}
            disabled={isFormSubmitting}
          />
        </Card.Section>
      </Card>
    </div>
  )
}
