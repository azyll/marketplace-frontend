export const ENDPOINT = {
  PRODUCT: {
    BASE: "/product",
    ID: "/product/:id",
  },
  CART: {
    BASE: "/cart",
  },
  ORDER: {
    BASE: "/order",
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
}
