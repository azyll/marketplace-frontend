import { Outlet } from "react-router"

export const UserLayout = () => {
  return (
    <div>
      User Layout
      <div>
        <Outlet />
      </div>
    </div>
  )
}
