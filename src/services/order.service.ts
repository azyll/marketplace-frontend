import { ENDPOINT } from "@/constants/endpoints";
import { IOrder } from "@/types/order.type";
import axios from "@/utils/axios";

export const createOrder = async (
  studentId: string,
  orderItems: { productVariantId: string; quantity: number }[],
  orderType: "cart" | "buy-now"
) => {
  const response = await axios.post<IOrder>(`${ENDPOINT.ORDER.BASE}`, {
    studentId,
    orderItems,
    orderType,
  });

  return response.data;
};

export const getOrder = async (orderId: string) => {
  const response = await axios.get<IOrder>(`${ENDPOINT.ORDER.BASE}/${orderId}`);

  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get<IOrder>(ENDPOINT.ORDER.BASE);

  return response.data;
};

export const getStudentOrders = async (
  studentId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: "ongoing" | "completed" | "cancelled";
  }
) => {
  const response = await axios.get(`${ENDPOINT.ORDER.BASE}/${studentId}`, {
    params,
  });

  return response.data;
};
