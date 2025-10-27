import { ENDPOINT } from "@/constants/endpoints"
import {
  IAnnouncement,
  ICreateAnnouncementInput,
  IGetAnnouncementFilters,
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

export const createAnnouncement = async (payload: ICreateAnnouncementInput) => {
  const response = await axios.post(ENDPOINT.ANNOUNCEMENT.BASE, payload)

  return response.data
}

export const updateDepartment = async (
  announcementId: string,
  payload: ICreateAnnouncementInput,
) => {
  const response = await axios.put<IAnnouncement>(
    ENDPOINT.ANNOUNCEMENT.ID.replace(":announcementId", announcementId),
    payload,
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
