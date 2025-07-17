import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/home/Home";
import App from "../App";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import Products from "../pages/products/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: "/products",
        Component: Products,
      },
      {
        path: "/products/:slug",
        Component: Products,
      },
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/cart",
        Component: Cart,
      },
    ],
  },
]);
