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
  getCart: () => {};
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
