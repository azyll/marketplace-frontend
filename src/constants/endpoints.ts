import { A } from "node_modules/react-router/dist/development/route-data-CqEmXQub.mjs"

export const ENDPOINT = {
  PRODUCT: {
    BASE: "/product",
    ID: "/product/:id",
    ATTRIBUTE: {
      BASE: "/product/create",
    },
    DEPARTMENT: {
      BASE: "/product/create",
    },
    INVENTORY: {
      BASE: "/product/inventory",
      ALERT: "/product/inventory/alerts",
      VALUE: "product/inventory/value",
    },
  },

  CART: {
    BASE: "/cart",
  },

  ORDER: {
    BASE: "/order",
    STUDENT: "/order/student",
    STATUS: "/order/status/:studentNumber",
    ANNUAL: "/order/annual",
    PROWARE: "/order/proware/create",
  },

  LOGIN: "/auth/login",

  USER: {
    BASE: "/user",
    ID: "/user/:userId",
    ORDER: "/user/orders",
  },

  STUDENT: {
    BASE: "/student",
    ID: "/student/:studentId",
    USER_ID: "/student/user/:userId",
    BULK: "/student/bulk",
  },

  ROLE: {
    BASE: "/role",
    ID: "/role/:roleId",
  },

  PROGRAM: {
    BASE: "/program",
  },

  DEPARTMENT: {
    BASE: "/department",
  },

  NOTIFICATION: {
    BASE: "/notification",
    RECEIVER: "/notification/receiver",
  },

  LOG: {
    BASE: "/log",
  },

  SALES: {
    BASE: "/sales",
    ID: "/sales/:salesId",
    ORDERID: "/sales/order/:orderId",
    ANNUAL: "/sales/annual",
    DEPARTMENT: "/sales/total-per-department",
    TREND: "/sales/trend",
  },

  REPORT: {
    SALES: "/report/sales",
    PRODUCT: "/report/product",
    INVENTORY: "/report/inventory",
    ORDER: "report/order",
  },
}
