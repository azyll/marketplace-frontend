import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/home/Home";
import Store from "../pages/store/Store";
import App from "../App";
import Login from "../pages/login/Login";
import Cart from "../pages/cart/Cart";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: "/store",
        Component: Store,
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
