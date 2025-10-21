import { ENDPOINT } from "@/constants/endpoints"
import axios from "@/utils/axios"
import { IDepartment, IGetDepartmentFilters } from "@/types/department.type"

export const getProductDepartments = async (
  filters: IGetDepartmentFilters,
): Promise<IDepartment[]> => {
  const response = await axios.get(ENDPOINT.PRODUCT.DEPARTMENT.BASE, {
    params: filters,
  })

  return response.data.departments.data ?? []
}
