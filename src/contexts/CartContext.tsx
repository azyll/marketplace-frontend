import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ICartContext, ICart } from "@/types/cart.type";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/services/cart.service";

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICart[]>([]);

  const getCart = async () => {};

  const addItem = async (productId: string) => {};

  const removeItem = async (productId: string) => {};

  const clear = async () => {};

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addToCart: addItem,
        removeFromCart: removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
