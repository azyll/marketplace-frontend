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
      CREATE: "/dashboard/orders/create",
    },
    INVENTORY: {
      BASE: "/dashboard/inventory",
    },
    SALES: {
      BASE: "/dashboard/sales",
      ID: "/dashboard/sales/:salesId",
    },
    ROLES: {
      BASE: "/dashboard/roles",
      ID: "/dashboard/roles/:roleId",
    },
    DEPARTMENTS: {
      BASE: "/dashboard/departments",
      ID: "/dashboard/departments/:departmentId",
    },
    PROGRAMS: {
      BASE: "/dashboard/programs",
      ID: "/dashboard/programs/:programId",
    },
    RETURN_ITEMS: {
      BASE: "/dashboard/return-items",
    },
    ACTIVITY_LOG: {
      BASE: "/dashboard/activity-logs",
    },
    ANNOUNCEMENT_CAROUSEL: {
      BASE: "/dashboard/announcement-carousel",
    },
  },
  AUTH: {
    BASE: "/auth",
    LOGIN: {
      BASE: "/auth/login",
    },
  },
}
