import { ENDPOINT } from "@/constants/endpoints"
import { IActivityLog, IGetActivityLogFilters } from "@/types/activity-log"
import { IPaginatedResponse } from "@/types/common.type"

import axios from "@/utils/axios"

export const getActivityLogs = async (filters: IGetActivityLogFilters) => {
  const response = await axios.get<IPaginatedResponse<IActivityLog[]>>(ENDPOINT.ACTIVITY_LOG.BASE, {
    params: filters,
  })

  return response.data
}
