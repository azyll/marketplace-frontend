import { createBrowserRouter } from "react-router"
import Home from "@/pages/home/Home"
import App from "@/App"
import Login from "@/pages/login/Login"
import Cart from "@/pages/cart/Cart"
import ProductList from "@/pages/products/ProductList"
import ProductPage from "@/pages/products/ProductPage"
import Profile from "@/pages/user/profile/Profile"
import User from "@/pages/user/User"
import Order from "@/pages/order/Order"
import OrderHistory from "@/pages/user/orders/OrderHistory"
import { DashboardLayout } from "@/pages/dashboard"
import { UserList } from "@/pages/dashboard/pages/user/UserList"
import { UserLayout } from "@/pages/dashboard/pages/user"
import { UserPage } from "@/pages/dashboard/pages/user/UserPage"
import { ROUTES } from "@/constants/routes"

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
        path: "/order",
        Component: Order,
      },

      {
        path: "/user",
        Component: User,
        children: [
          { index: true, Component: Profile },
          {
            path: "orders",
            Component: OrderHistory,
          },
        ],
      },

      // Dashboard Routes
      {
        path: ROUTES.DASHBOARD.BASE,
        Component: DashboardLayout,
        children: [
          {
            path: ROUTES.DASHBOARD.USER.BASE,
            Component: UserLayout,
            children: [
              {
                index: true,
                Component: UserList,
              },
              {
                path: ROUTES.DASHBOARD.USER.ID,
                Component: UserPage,
              },
            ],
          },
        ],
      },
    ],
  },
])
