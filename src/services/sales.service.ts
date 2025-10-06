import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"

export const getAnnualSales = async () => {
  const response = (await axios.get)(ENDPOINT.SALES.ANNUAL)

  return response
}
