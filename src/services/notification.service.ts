import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedNotificationResponse } from "@/types/notification.type"
import axios from "@/utils/axios"

export const getUserNotifications = async (userId: string) => {
  const response = await axios.get<IPaginatedNotificationResponse>(
    ENDPOINT.NOTIFICATION.ID.replace(":userId", userId),
  )

  return response.data
}

export const updateNotificationStatus = async (userId: string, notificationId: string) => {
  const response = await axios.put(
    ENDPOINT.NOTIFICATION.ID.replace(":userId", userId),
    {},
    { params: { notificationId } },
  )

  return response.data
}

//Logs
export const getLogs = async (type: string) => {
  const response = await axios.get(ENDPOINT.ACTIVITY_LOG.BASE, { params: { type } })

  return response.data
}
