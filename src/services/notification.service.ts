import { ENDPOINT } from "@/constants/endpoints"
import { INotification } from "@/types/notification.type"
import axios from "@/utils/axios"

export const getUserNotifications = async (userId: string) => {
  const response = await axios.get<INotification>(`${ENDPOINT.NOTIFICATION}/${userId}`)

  return response.data
}

export const getLogs = async (type: string) => {
  const response = await axios.get(ENDPOINT.LOG.BASE, { params: { type } })

  return response.data
}
