import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"
import { IDepartment } from "@/types/department.type"

export const getProductDepartments = async (): Promise<IDepartment[]> => {
  const response = await axios.get(ENDPOINT.PRODUCT.DEPARTMENT.BASE)

  return response?.data?.data?.departments ?? []
}
