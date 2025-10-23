import { ICreateProgramInput, IGetProgramsFilters, IProgram } from "@/types/program.type"
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

export const deleteProgram = async (programId: string) => {
  const response = await axios.delete(ENDPOINT.PROGRAM.ID.replace(":programId", programId))

  return response.data
}

export const restoreProgram = async (programId: string) => {
  const response = await axios.put(ENDPOINT.PROGRAM.RESTORE.replace(":programId", programId))

  return response.data
}
export const getProgramById = async (programId: string) => {
  const response = await axios.get<IProgram>(ENDPOINT.PROGRAM.ID.replace(":programId", programId))

  return response.data
}

export const createProgram = async (payload: ICreateProgramInput) => {
  const response = await axios.post<IProgram>(ENDPOINT.PROGRAM.BASE, payload)

  return response.data
}

export const updateProgram = async (programId: string, payload: ICreateProgramInput) => {
  const response = await axios.put<IProgram>(
    ENDPOINT.PROGRAM.ID.replace(":programId", programId),
    payload,
  )

  return response.data
}
