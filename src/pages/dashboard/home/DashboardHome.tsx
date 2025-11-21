import { useQuery } from "@tanstack/react-query"
import InventoryDashboard from "./InventoryDashboard"
import OrdersDashboard from "./OrdersDashboard"
import SalesDashboard from "./SalesDashboard"
import { getLoggedInUser } from "@/services/user.service"
import { useNavigate } from "react-router"
import { KEY } from "@/constants/key"
import { Loader, Text } from "@mantine/core"

export const DashboardHomePage = () => {
  const { data: user, isLoading: iseGettingUser } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })
  const saleModulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "sales",
  )
  const ordersModulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "orders",
  )
  const inventoryModulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "inventory",
  )
  return (
    <main className="mx-auto flex max-w-[1200px] flex-col">
      <Text fw={"bold"} my={"sm"} size="lg">
        Home Dashboard
      </Text>
      {iseGettingUser ? <Loader /> : null}
      {ordersModulePermission || user?.role.systemTag === "admin" ? <OrdersDashboard /> : null}
      {inventoryModulePermission || user?.role.systemTag === "admin" ? (
        <InventoryDashboard />
      ) : null}
      {saleModulePermission || user?.role.systemTag === "admin" ? <SalesDashboard /> : null}
    </main>
  )
}
