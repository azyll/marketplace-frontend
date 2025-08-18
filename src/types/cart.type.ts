export interface ICart {
  id: number;
  quantity: number;
  studentId: number | null;
  productVariantId: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface ICartContext {
  cart: ICart[] | null;
  getCart: () => Promise<void>;
  addToCart: (productVariantId: string) => Promise<void>;
  removeFromCart: (productVariantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
