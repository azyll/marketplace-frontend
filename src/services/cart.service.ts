import { ENDPOINT } from "@/constants/endpoints";
import { ICart } from "@/types/cart.type";
import axios from "@/utils/axios";

// Get all items in the cart
export const getItems = async (userId: string) => {
  const response = await axios.get<ICart[]>(`${ENDPOINT.CART.BASE}/${userId}`);

  return response.data;
};

// Add a product to the cart (always 1 quantity by default)
export const addItem = async (userId: string, productVariantId: string) => {
  const response = await axios.post(`${ENDPOINT.CART.BASE}/${userId}`, {
    product: { productVariantId },
  });

  return response.data;
};

// Remove a product from the cart
export const removeItem = async (userId: string, productVariantId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`, {
    data: { productVariantIds: [productVariantId] }, // backend expects array
  });

  return response.data;
};

// Clear all items in the cart
export const clearItems = async (userId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`);

  return response.data;
};

export const updateItem = async (userId: string, cartId: string) => {
  const response = await axios.put(`${ENDPOINT.CART.BASE}/${userId}`, {
    cartId,
  });

  return response.data;
};
