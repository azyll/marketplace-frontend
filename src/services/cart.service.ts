import { ENDPOINT } from "@/constants/endpoints"
import { ICart } from "@/types/cart.type"
import { IPaginatedResponse, IPagination, IResponse } from "@/types/common.type"
import axios from "@/utils/axios"

// Get all items in the cart
export const getItems = async (userId: string, params?: IPagination) => {
  const response = await axios.get<IPaginatedResponse<ICart[]>>(
    ENDPOINT.CART.ID.replace(":userId", userId),
    { params },
  )

  return response.data
}

// Add a product to the cart
export const addItem = async (userId: string, productId: string | undefined, quantity: number) => {
  const response = await axios.post(`${ENDPOINT.CART.BASE}/${userId}`, {
    product: productId,
    quantity,
  })

  return response.data
}

// Remove a product from the cart
export const removeItem = async (userId: string, productVariantId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`, {
    data: { productVariantIds: [productVariantId] },
  })
  return response.data
}

// Clear all items in the cart
export const clearItems = async (userId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`, {
    data: { productVariantIds: [] },
  })
  return response.data
}

// Update cart item (increase/decrease quantity, etc.)
export const updateItem = async (userId: string, quantity: number) => {
  const response = await axios.put(`${ENDPOINT.CART.BASE}/${userId}`, {
    quantity,
  })
  return response.data
}

//Increase cart item quantity
export const addItemQuantity = async (userId: string, cartId: number) => {
  const response = await axios.put(`${ENDPOINT.CART.BASE}/${userId}/add/`, { cartId })

  return response.data
}

//Deduct cart item quantity
export const deductItemQuantity = async (userId: string, cartId: number) => {
  const response = await axios.put(`${ENDPOINT.CART.BASE}/${userId}/deduct/`, { cartId })

  return response.data
}
