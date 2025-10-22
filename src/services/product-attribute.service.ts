import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"

export const getProductAttributes = async () => {
  const response = await axios.get(ENDPOINT.PRODUCT.ATTRIBUTE.BASE)

  return response?.data?.productAttribute ?? []
}
