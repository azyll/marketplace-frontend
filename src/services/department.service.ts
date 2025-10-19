import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"

export const getDepartments = async () => {
  const response = await axios.get(ENDPOINT.DEPARTMENT.BASE, {
    params: { all: "true" },
  })

  return response.data
}
