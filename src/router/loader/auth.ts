import { ROUTES } from "@/constants/routes"
import { redirect } from "react-router"
import { getLoggedInUser } from "@/services/user.service"

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
