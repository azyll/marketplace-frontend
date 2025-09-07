import { IGetProgramsFilters, IProgram } from "@/types/program.type"
import axios from "@/utils/axios"
import { IPaginatedResponse } from "@/types/common.type"
import { ENDPOINT } from "@/constants/endpoints"

export const getPrograms = async (filters: IGetProgramsFilters) => {
  try {
    const response = await axios.get<IPaginatedResponse<IProgram[]>>(ENDPOINT.PROGRAM.BASE, {
      params: filters,
    })

    return response.data
  } catch (error) {
    console.log(error)
  }
}
