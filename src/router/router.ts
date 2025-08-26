import { createBrowserRouter } from "react-router";
import Home from "@/pages/home/Home";
import App from "@/App";
import Login from "@/pages/login/Login";
import Cart from "@/pages/cart/Cart";
import ProductList from "@/pages/products/ProductList";
import ProductPage from "@/pages/products/ProductPage";
import Checkout from "@/pages/checkout/Checkout";
import Profile from "@/pages/user/profile/Profile";
import User from "@/pages/user/User";
import Order from "@/pages/user/orders/Order";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: "/products",
        Component: ProductList,
      },
      {
        path: "/products/:slug",
        Component: ProductPage,
      },
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/cart",
        Component: Cart,
      },

      {
        path: "/user",
        Component: User,
        children: [
          { index: true, Component: Profile },
          {
            path: "orders",
            Component: Order,
          },
        ],
      },
      // {
      //   path: "/order/checkout",
      //   Component: Checkout,
      // },
    ],
  },
]);
