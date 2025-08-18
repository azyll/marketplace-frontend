import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ICartContext, ICart } from "@/types/cart.type";
import {
  addItem,
  clearItems,
  getItems,
  removeItem,
} from "@/services/cart.service";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext<ICartContext>({
  cart: [],
  getCart: async () => {},
  addToCart: async (_productVariantId: string) => {},
  removeFromCart: async (_productVariantId: string) => {},
  clearCart: async () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState<ICart[]>([]);

  const getCart = async () => {
    if (!user) return; // not logged in

    try {
      const data = await getItems(user.id); // or user._id depending on your backend

      setCart(data || []);
    } catch (err) {}
  };

  const addToCart = async (productVariantId: string) => {
    if (!user) return;

    try {
      await addItem(user.id, productVariantId);
      await getCart(); // refresh
    } catch (err) {}
  };

  const removeFromCart = async (productVariantId: string) => {};

  const clearCart = async () => {};

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
