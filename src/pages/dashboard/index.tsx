import { Outlet } from "react-router"

export const DashboardLayout = () => {
  return (
    <main>
      <div>Navbar</div>
      <div>Sidebar</div>

      <div>
        <Outlet />
      </div>
    </main>
  )
}
