import { notifications } from "@mantine/notifications"
import { AxiosError } from "axios"

function capitalizeFirstLetter(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return str // Handle empty strings or non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const notifyResponseError = (
  error: AxiosError<{ message: string; error: string | any[] }>,
  label: string,
  type: "create" | "update" | "remove" | "delete",
) => {
  const TYPES = { create: "Create", update: "Update", remove: "Remove", delete: "Delete" }
  const _type = TYPES[type]
  const _label = capitalizeFirstLetter(label)

  if (Array.isArray(error?.response?.data?.error)) {
    notifications.show({
      title: `${_type} Failed`,
      message:
        error?.response?.data?.error?.[0]?.message ??
        error?.response?.data?.error ??
        `Can't ${_type} ${_label}`,
      color: "red",
    })
    return
  }

  if (typeof error?.response?.data?.error === "string") {
    notifications.show({
      title: `${_type} Failed`,
      message: error?.response?.data?.error ?? `Can't ${_type} ${_label}`,
      color: "red",
    })
    return
  }

  notifications.show({
    title: `${_type} Failed`,
    message: `Can't ${_type} ${_label}`,
    color: "red",
  })
}
