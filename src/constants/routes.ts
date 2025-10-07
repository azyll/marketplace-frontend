export const ROUTES = {
  DASHBOARD: {
    BASE: "/dashboard",
    USER: {
      BASE: "/dashboard/users",
      ID: "/dashboard/users/:userId",
    },
    PRODUCTS: {
      BASE: "/dashboard/products",
      ID: "/dashboard/products/:productId",
    },
    ORDERS: {
      BASE: "/dashboard/orders",
      ID: "/dashboard/orders/:orderId",
    },
    INVENTORY: {
      BASE: "/dashboard/inventory",
    },
  },
  AUTH: {
    BASE: "/auth",
    LOGIN: {
      BASE: "/auth/login",
    },
  },
}
