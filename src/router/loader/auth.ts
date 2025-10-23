import { ROUTES } from "@/constants/routes"
import { redirect } from "react-router"
import { getLoggedInUser } from "@/services/user.service"
import { IRole } from "@/types/role.type"

export const dashboardLoader = async () => {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    return redirect("/")
  }

  const user = await getLoggedInUser()

  if (!user) return redirect("/")

  const allowedRoles = ["admin", "employee"]

  if (!allowedRoles.includes(user.data.role.systemTag)) return redirect("/")
}

const REDIRECT = {
  admin: ROUTES.DASHBOARD.USER.BASE,
  employee: ROUTES.DASHBOARD.PRODUCTS.BASE,
  student: "/",
}

export const roleLoader = async (roles: IRole["systemTag"][], redirectUrl?: string) => {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    return redirect("/")
  }

  const user = await getLoggedInUser()

  if (!user) return redirect("/")

  const userRole = user.data.role.systemTag
  const defaultRedirect = redirectUrl ?? REDIRECT[userRole]

  const allowedRoles = roles

  if (!allowedRoles.includes(userRole)) return redirect(defaultRedirect)
}
