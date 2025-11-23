import { ENDPOINT } from "@/constants/endpoints"
import {
  IAnnouncement,
  ICreateAnnouncementInput,
  IGetAnnouncementFilters,
  IUpdateAnnouncementInput,
} from "@/types/announcement.type"
import { IPaginatedResponse } from "@/types/common.type"
import axios from "@/utils/axios"

export const getAnnouncements = async (filters: IGetAnnouncementFilters) => {
  const response = await axios.get<IPaginatedResponse<IAnnouncement[]>>(
    ENDPOINT.ANNOUNCEMENT.BASE,
    {
      params: filters,
    },
  )

  return response.data
}

export const getAnnouncementById = async (id: string) => {
  const response = await axios.get<IAnnouncement>(
    ENDPOINT.ANNOUNCEMENT.ID.replace(":announcementId", id),
  )
  return response.data
}
export const createAnnouncement = async (payload: ICreateAnnouncementInput) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (key === "image" && value instanceof File) {
      formData.append("image", value)
    } else {
      formData.append(key, String(value))
    }
  })

  const response = await axios.post(ENDPOINT.ANNOUNCEMENT.BASE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateAnnouncement = async (
  announcementId: string,
  payload: IUpdateAnnouncementInput,
) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (key === "image" && value instanceof File) {
      formData.append("image", value)
    } else {
      formData.append(key, String(value))
    }
  })
  const response = await axios.put<IAnnouncement>(
    `${ENDPOINT.ANNOUNCEMENT.ID.replace(":announcementId", announcementId)}/update`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return response.data
}
export const deleteAnnouncement = async (announcementId: string) => {
  const response = await axios.delete(
    ENDPOINT.ANNOUNCEMENT.ID.replace(":announcementId", announcementId),
  )

  return response.data
}

export const restoreArchivedAnnouncement = async (announcementId: string) => {
  const response = await axios.put(
    ENDPOINT.ANNOUNCEMENT.ID.replace(":announcementId", announcementId),
  )

  return response.data
}
