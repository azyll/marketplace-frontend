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
  },

  CART: {
    BASE: "/cart",
  },

  ORDER: {
    BASE: "/order",
    STUDENT: "/order/student",
    STATUS: "/order/status/:studentNumber",
    ANNUAL: "/order/annual",
  },

  LOGIN: "/auth/login",

  USER: {
    BASE: "/user",
    ID: "/user/:userId",
    ORDER: "/user/orders",
  },

  ROLE: {
    BASE: "/role",
    ID: "/role/:roleId",
  },

  PROGRAM: {
    BASE: "/program",
  },

  STUDENT: {
    BASE: "/student",
    ID: "/student/:studentId",
    USER_ID: "/student/user/:userId",
  },

  NOTIFICATION: {
    BASE: "/notification",
    RECEIVER: "/notification/receiver",
  },

  SALES: {
    BASE: "/sales",
    ANNUAL: "/sales/annual",
  },
}
