import { useForm, UseFormReturnType } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { Ref, useImperativeHandle, useMemo } from "react"
import { Grid, Textarea, TextInput, Title } from "@mantine/core"

import { IAnnouncement, ICreateAnnouncementInput } from "@/types/announcement.type"
import { ImageUpload } from "@/components/ImageUpload"
import { createAnnouncementSchema, updateAnnouncementSchema } from "@/schema/announcement.schema"

export interface AnnouncementDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateAnnouncementInput>>
}

interface Props {
  ref: Ref<AnnouncementDetailsFormRef>
  disabled?: boolean
  announcement?: IAnnouncement
  imageDefaultValue?: string
  initialValues?: Partial<IAnnouncement>
}

export const AnnouncementDetailsForm = ({
  ref,
  disabled,
  announcement,
  initialValues,
  imageDefaultValue,
}: Props) => {
  const isUpdate = useMemo(() => !!announcement, [announcement])
  const form = useForm<Partial<ICreateAnnouncementInput>>({
    initialValues: {
      title: initialValues?.title ?? "",
      message: initialValues?.message ?? undefined,
      productId: initialValues?.productId ?? undefined,
    },
    validate: zod4Resolver(isUpdate ? updateAnnouncementSchema : createAnnouncementSchema),
  })

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <div>
      <Title order={4} mb={12}>
        Announcement Carousel Details
      </Title>

      <form>
        <Grid>
          <Grid.Col span={12}>
            <ImageUpload
              maxFiles={1}
              multiple={false}
              onDrop={(files) => form.setFieldValue("image", files[0])}
              defaultPreview={imageDefaultValue}
              disabled={disabled}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            {/*  Title */}
            <TextInput label="Title" {...form.getInputProps("title")} disabled={disabled} />
          </Grid.Col>

          <Grid.Col span={12}>
            {/*  Message */}
            <Textarea label="Message" {...form.getInputProps("message")} disabled={disabled} />
          </Grid.Col>
        </Grid>
      </form>
    </div>
  )
}
