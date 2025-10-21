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
import { ROUTES } from "@/constants/routes"
import { BaseLayout } from "@/layouts/BaseLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { MarketplaceLayout } from "@/layouts/MarketplaceLayout"

import { UserPage } from "@/pages/dashboard/user/page"
import { UserList } from "@/pages/dashboard/user/list"
import { ProductPage as DashboardProductPage } from "@/pages/dashboard/products/page"
import { ProductList as DashboardProductList } from "@/pages/dashboard/products/list"
import { OrdersList as DashboardOrdersList } from "@/pages/dashboard/orders/list"
import { OrdersPage as DashboardOrdersPage } from "@/pages/dashboard/orders/page"
import { InventoryList as DashboardInventoryList } from "@/pages/dashboard/inventory/list"
import { SalesList as DashboardSalesList } from "@/pages/dashboard/sales/list"
import { SalesPage as DashboardSalesPage } from "@/pages/dashboard/sales/page"

import { dashboardLoader } from "@/router/loader/auth"
import { OrderFormPage } from "@/pages/dashboard/orders/form"
import { RoleList as DashboardRoleList } from "@/pages/dashboard/roles/list"
import { DepartmentList as DashboardDepartmentList } from "@/pages/dashboard/departments/list"
import { ProgramList as DashboardProgramList } from "@/pages/dashboard/programs/list"
import { ProgramPage } from "@/pages/dashboard/programs/page"
import { DepartmentPage } from "@/pages/dashboard/departments/page"
import { RolePage } from "@/pages/dashboard/roles/page"

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
            path: "/order/:orderId",
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
        loader: dashboardLoader,
        children: [
          {
            index: true,
            loader: () => redirect(ROUTES.DASHBOARD.USER.BASE),
          },

          // Users
          {
            path: ROUTES.DASHBOARD.USER.BASE,
            Component: UserList,
          },
          {
            path: ROUTES.DASHBOARD.USER.ID,
            Component: UserPage,
          },

          // Products
          {
            path: ROUTES.DASHBOARD.PRODUCTS.BASE,
            Component: DashboardProductList,
          },
          {
            path: ROUTES.DASHBOARD.PRODUCTS.ID,
            Component: DashboardProductPage,
          },

          // Orders
          {
            path: ROUTES.DASHBOARD.ORDERS.BASE,
            Component: DashboardOrdersList,
          },
          {
            path: ROUTES.DASHBOARD.ORDERS.CREATE,
            Component: OrderFormPage,
          },
          {
            path: ROUTES.DASHBOARD.ORDERS.ID,
            Component: DashboardOrdersPage,
          },

          // Inventory
          {
            path: ROUTES.DASHBOARD.INVENTORY.BASE,
            Component: DashboardInventoryList,
          },

          // Sales
          {
            path: ROUTES.DASHBOARD.SALES.BASE,
            Component: DashboardSalesList,
          },
          {
            path: ROUTES.DASHBOARD.SALES.ID,
            Component: DashboardSalesPage,
          },
          // Roles
          {
            path: ROUTES.DASHBOARD.ROLES.BASE,
            Component: DashboardRoleList,
          },
          {
            path: ROUTES.DASHBOARD.ROLES.ID,
            Component: RolePage,
          },
          // Department
          {
            path: ROUTES.DASHBOARD.DEPARTMENTS.BASE,
            Component: DashboardDepartmentList,
          },
          {
            path: ROUTES.DASHBOARD.DEPARTMENTS.ID,
            Component: DepartmentPage,
          },
          // Program
          {
            path: ROUTES.DASHBOARD.PROGRAMS.BASE,
            Component: DashboardProgramList,
          },
          {
            path: ROUTES.DASHBOARD.PROGRAMS.ID,
            Component: ProgramPage,
          },
        ],
      },
    ],
  },
])
