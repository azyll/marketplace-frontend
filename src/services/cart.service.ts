import { ENDPOINT } from "@/constants/endpoints";
import { ICart } from "@/types/cart.type";
import axios from "@/utils/axios";

// Get all items in the cart
export const getCart = async () => {
  const response = await axios.get<ICart[]>(ENDPOINT.CART.BASE);
  return response.data;
};

// Add a product to the cart (always 1 quantity by default)
export const addToCart = async (productId: string) => {
  const response = await axios.post<ICart>(ENDPOINT.CART.BASE, {
    productId,
  });
  return response.data;
};

// Remove a product from the cart
export const removeFromCart = async (productId: string) => {
  const response = await axios.delete(`${ENDPOINT.CART.BASE}/${productId}`);
  return response.data;
};

// Clear all items in the cart
export const clearCart = async () => {
  const response = await axios.delete(ENDPOINT.CART.BASE);
  return response.data;
};
