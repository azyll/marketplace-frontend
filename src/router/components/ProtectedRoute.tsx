import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { getLoggedInUser } from "@/services/user.service"
import { IRole } from "@/types/role.type"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet } from "react-router"

const REDIRECT = {
  admin: ROUTES.DASHBOARD.USER.BASE,
  employee: ROUTES.DASHBOARD.PRODUCTS.BASE,
  student: "/",
}

interface Props {
  roles?: IRole["systemTag"][]
}
function ProtectedRoute({ roles = [] }: Props) {
  const token = localStorage.getItem("accessToken")

  const { data: user, isLoading } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })

  if (isLoading) return "Loading.."
  if (!token) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/" replace />

  const userRole = user.role.systemTag
  const defaultRedirect = REDIRECT[userRole]

  const allowedRoles = roles

  if (!allowedRoles.includes(userRole)) return <Navigate to={defaultRedirect} replace />

  return <Outlet />
}

export function createProtectedRoute(roles?: IRole["systemTag"][]) {
  return function ProtectedRouteWrapper() {
    return <ProtectedRoute roles={roles} />
  }
}
