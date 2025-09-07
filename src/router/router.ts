import { createBrowserRouter, redirect } from "react-router"
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
import { UserList } from "@/pages/dashboard/user/UserList"
import { UserLayout } from "@/pages/dashboard/user"
import { UserPage } from "@/pages/dashboard/user/UserPage"
import { ROUTES } from "@/constants/routes"
import { BaseLayout } from "@/layouts/BaseLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { MarketplaceLayout } from "@/layouts/MarketplaceLayout"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        Component: MarketplaceLayout,
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
        ],
      },

      // Auth Routes
      {
        path: ROUTES.AUTH.BASE,
        Component: BaseLayout,
        children: [
          {
            index: true,
            loader: () => redirect(ROUTES.AUTH.LOGIN.BASE),
          },
          {
            path: ROUTES.AUTH.LOGIN.BASE,
            Component: Login,
          },
        ],
      },

      // Dashboard Routes
      {
        path: ROUTES.DASHBOARD.BASE,
        Component: DashboardLayout,
        children: [
          {
            index: true,
            loader: () => redirect(ROUTES.DASHBOARD.USER.BASE),
          },
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
