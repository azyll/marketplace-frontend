import { ENDPOINT } from "@/constants/endpoints"
import { IPaginatedResponse } from "@/types/common.type"
import {
  ICreateProductInput,
  IProduct,
  IProductListFilters,
  IProductVariant,
  IUpdateProductInput,
} from "@/types/product.type"
import axios from "@/utils/axios"

export const getProductList = async (filters: IProductListFilters) => {
  const response = await axios.get<IPaginatedResponse<IProduct[]>>(ENDPOINT.PRODUCT.BASE, {
    params: filters,
  })
  return response.data
}

export const getInventoryProducts = async (filters: IProductListFilters) => {
  const response = await axios.get<IPaginatedResponse<IProduct[]>>(
    ENDPOINT.PRODUCT.INVENTORY.BASE,
    {
      params: filters,
    },
  )
  return response.data
}

export const getProductBySlug = async (slug: string) => {
  const response = await axios.get<{ data: IProduct; message: string }>(
    `${ENDPOINT.PRODUCT.BASE}/${slug}`,
  )

  return response.data
}

export const createProduct = async (payload: ICreateProductInput) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "variants") {
      formData.append("variants", JSON.stringify(value))
    } else if (key === "image" && value instanceof File) {
      formData.append("image", value)
    } else {
      formData.append(key, String(value))
    }
  })

  const response = await axios.post(ENDPOINT.PRODUCT.BASE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateProduct = async (productId: string, payload: IUpdateProductInput) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "variants") {
      formData.append("variants", JSON.stringify(value))
    } else if (key === "image" && value instanceof File) {
      formData.append("image", value)
    } else {
      formData.append(key, String(value))
    }
  })

  const response = await axios.put(ENDPOINT.PRODUCT.ID.replace(":id", productId), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateProductStock = async (
  action: "add" | "minus",
  payload: { productVariantId: string; newStockQuantity: number },
) => {
  const response = await axios.patch(`${ENDPOINT.PRODUCT.BASE}/stock`, payload, {
    params: { action },
  })

  return response.data
}

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(ENDPOINT.PRODUCT.ID.replace(":id", productId))

  return response.data
}
