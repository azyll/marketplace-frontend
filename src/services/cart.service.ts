import { ENDPOINT } from "@/constants/endpoints";
import { ICart } from "@/types/cart.type";
import axios from "@/utils/axios";

// Get all items in the cart
export const getItems = async (userId: string) => {
  const response = await axios.get<{ message: string; data: ICart[] }>(
    `${ENDPOINT.CART.BASE}/${userId}`
  );
  return response.data.data;
};

// Add a product to the cart
export const addItem = async (
  userId: string,
  productId: string,
  quantity: number = 1
) => {
  const response = await axios.post(`${ENDPOINT.CART.BASE}/${userId}`, {
    product: productId,
    quantity,
  });

  return response.data;
};

// Remove a product from the cart
export const removeItem = async (userId: string, productVariantId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`, {
    data: { productVariantIds: [productVariantId] },
  });
  return response.data;
};

// Clear all items in the cart
export const clearItems = async (userId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${userId}`, {
    data: { productVariantIds: [] },
  });
  return response.data;
};

// Update cart item (increase/decrease quantity, etc.)
export const updateItem = async (userId: string, cartId: string) => {
  const response = await axios.put(`${ENDPOINT.CART.BASE}/${userId}`, {
    cartId,
  });
  return response.data;
};
