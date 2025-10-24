import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"

export const getAnnouncements = async () => {
  const response = await axios.get(ENDPOINT.ANNOUNCEMENT.BASE)

  return response.data
}

export const getArchivedAnnouncements = async () => {
  const response = await axios.get(ENDPOINT.ANNOUNCEMENT.ARCHIVE)

  return response.data
}

export const createAnnouncement = async (image: File) => {
  const response = await axios.post(ENDPOINT.ANNOUNCEMENT.BASE, image)

  return response.data
}

export const deleteAnnouncement = async (announcementId: string) => {
  const response = await axios.delete(
    ENDPOINT.ANNOUNCEMENT.ID.replace("announcementId", announcementId),
  )

  return response.data
}

export const restoreArchivedAnnouncement = async (announcementId: string) => {
  const response = await axios.put(
    ENDPOINT.ANNOUNCEMENT.ID.replace("announcementId", announcementId),
  )

  return response.data
}
