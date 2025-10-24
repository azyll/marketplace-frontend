import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { getLoggedInUser } from "@/services/user.service"
import { IRole, IRoleAccessModule, Module } from "@/types/role.type"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation } from "react-router"

const REDIRECT = {
  admin: ROUTES.DASHBOARD.USER.BASE,
  employee: ROUTES.DASHBOARD.USER.BASE,
  student: "/",
}
// Helper function to map a route path to a module name
export const getModuleFromPathname = (pathname: string): Module | null => {
  // Logic to find the module segment (e.g., 'orders' from '/dashboard/orders/create')
  const pathSegments = pathname.split("/").filter(Boolean)

  // Find the index of the segment that is one position after 'dashboard'
  const dashboardIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === "dashboard")

  if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
    const moduleSegment = pathSegments[dashboardIndex + 1].toLowerCase()

    // Map the path segment to the Module enum value
    switch (moduleSegment) {
    case "sales":
        return Module.Sales
      case "orders":
        return Module.Orders
      case "inventory":
        return Module.Inventory
      case "return-items":
        return Module.ReturnItems
      case "users":
        return Module.Users
          case "products":
        return Module.Products

      default:
        return null // Not a protected module route
    }
  }
  return null
}

export const checkModuleAccess = (module: Module, permissions: IRoleAccessModule[]): boolean => {
  return permissions.some(
    (p) => p.module === module && (p.permission === "view" || p.permission === "edit"),
  )
}
interface Props {
  roles?: IRole["systemTag"][]
}
function ProtectedRoute({ roles = [] }: Props) {
  const token = localStorage.getItem("accessToken")
  const location = useLocation() // Get the current URL path
  const { data: user, isLoading } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })

  if (isLoading) return ""
  if (!token) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/" replace />

  const userRole = user.role.systemTag
  const defaultRedirect = REDIRECT[userRole]

  const allowedRoles = roles

  if (!allowedRoles.includes(userRole)) return <Navigate to={defaultRedirect} replace />

  if (userRole === "employee") {
    const currentModule = getModuleFromPathname(location.pathname)

    // Only check permissions if the route corresponds to a defined Module
    if (currentModule) {
      const hasViewPermission = user.role.modulePermission.some(
        (permission) =>
          permission.module === currentModule &&
          (permission.permission === "view" || permission.permission === "edit"),
      )

      // If the user is an employee and lacks 'view' permission for the module
      if (!hasViewPermission) {
        // Redirect to a safe page (e.g., /dashboard)
        return <Navigate to={defaultRedirect} replace />
      }
    }
  }

  return <Outlet />
}

export function createProtectedRoute(roles?: IRole["systemTag"][]) {
  return function ProtectedRouteWrapper() {
    return <ProtectedRoute roles={roles} />
  }
}
