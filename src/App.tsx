import { FC, useContext } from "react"
import { Outlet, useLocation } from "react-router"
import { AuthContext } from "./contexts/AuthContext"
import SplashScreen from "./components/SplashScreen"
import { ROUTES } from "@/constants/routes"

const App: FC = () => {
  const { isLoading } = useContext(AuthContext)
  const location = useLocation()

  const excludedHeaderRoutes = ["/auth/login", ROUTES.DASHBOARD.BASE]

  const hasHeader = excludedHeaderRoutes.every(
    (route) => location.pathname !== route && !location.pathname.startsWith(`${route}/`),
  )

  if (isLoading) {
    return <SplashScreen />
  }

  return <Outlet />
}

export default App
