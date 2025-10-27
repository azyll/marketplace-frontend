import { ENDPOINT } from "@/constants/endpoints"
import { IAnnouncement, IGetAnnouncementFilters } from "@/types/announcement.type"
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

// export const getArchivedAnnouncements = async () => {
//   const response = await axios.get(ENDPOINT.ANNOUNCEMENT.ARCHIVE)

//   return response.data
// }

export const createAnnouncement = async (image: File) => {
  const response = await axios.post(ENDPOINT.ANNOUNCEMENT.BASE, image)

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
