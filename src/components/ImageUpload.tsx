import { Group, Text } from "@mantine/core"
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react"
import { Dropzone, DropzoneProps, FileRejection, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useEffect, useMemo, useState } from "react"
import { notifications } from "@mantine/notifications"
import { bytesToMB } from "@/helper/bytesToMb"

interface Props extends Partial<DropzoneProps> {
  defaultPreview?: string | string[]
  previewWidth?: number
  previewHeight?: number
}

export function ImageUpload({
  onDrop,
  defaultPreview,
  previewHeight = 280,
  previewWidth = 280,
  ...props
}: Props) {
  const MAX_SIZE = props.maxSize ?? 5 * 1024 ** 2

  const [previews, setPreviews] = useState<string[]>(
    defaultPreview ? (Array.isArray(defaultPreview) ? defaultPreview : [defaultPreview]) : [],
  )

  useEffect(() => {
    if (previews.length <= 0) {
      setPreviews(
        defaultPreview ? (Array.isArray(defaultPreview) ? defaultPreview : [defaultPreview]) : [],
      )
    }
  }, [defaultPreview])

  const hasPreviews = useMemo(() => previews.length, [previews])

  const handleDrop = (acceptedFiles: File[]) => {
    // create local preview URLs for display
    const urls = acceptedFiles.map((file) => URL.createObjectURL(file))

    setPreviews((prev) => (props.multiple === false ? urls : [...prev, ...urls]))

    onDrop?.(acceptedFiles)
  }

  const handleReject = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((rej) => {
      rej.errors.forEach((err) => {
        let message = err.message

        // Customize message for file-too-large
        if (err.code === "file-too-large") {
          const fileSizeMB = bytesToMB(rej.file.size)
          message = `File is too large: ${fileSizeMB} MB (max ${MAX_SIZE} MB)`
        }

        notifications.show({
          title: "Upload error",
          message,
          color: "red",
        })
      })
    })
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={handleReject}
      maxSize={MAX_SIZE}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      {!hasPreviews ? (
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach 1 image (maximum size: 5 MB)
            </Text>
          </div>
        </Group>
      ) : (
        <div className="my-4 flex w-full flex-wrap justify-center gap-4">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              style={{
                width: previewWidth,
                height: previewHeight,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      )}
    </Dropzone>
  )
}
