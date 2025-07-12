import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/home/Home";
import Store from "../pages/store/Store";
import App from "../App";

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
    ],
  },
]);
