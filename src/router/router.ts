import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/home/Home";
import App from "../App";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/components/ProductDetails";

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
        path: "/products/slug/:slug",
        Component: ProductDetails,
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
