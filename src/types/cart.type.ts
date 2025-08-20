import { IProductVariant } from "./product.type";

export interface ICart {
  id: number;
  quantity: number;
  studentId: number | null;
  productVariantId: string;
  productVariant: IProductVariant;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface ICartContext {
  cart: ICart[] | null;
  getCart: () => Promise<void>;
  addToCart: (
    productVariantId: string
  ) => Promise<{ type: "success" | "error"; message: string }>;
  removeFromCart: (productVariantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
