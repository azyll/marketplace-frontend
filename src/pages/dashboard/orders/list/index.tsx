import { ActionIcon, Badge, Box, Button, Card, CopyButton, Space, Tooltip } from "@mantine/core"
import { OrdersFilter } from "@/pages/dashboard/orders/list/OrdersFilter"
import { useFilters } from "@/hooks/useFilters"
import { IOrder, IOrderFilters, IOrderStatusType } from "@/types/order.type"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { IconCheck, IconCopy, IconMoodSad, IconNotes } from "@tabler/icons-react"
import { ORDER_STATUS, orderStatusColor, orderStatusLabel } from "@/constants/order"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductList } from "@/services/products.service"
import { getAnnualOrders, getOrders } from "@/services/order.service"
import dayjs from "dayjs"
import { useClipboard } from "@mantine/hooks"
import { useNavigate, useSearchParams } from "react-router"
import { ROUTES } from "@/constants/routes"
import AnnualChart from "../../components/AnnualChart"
import { useEffect, useMemo, useState } from "react"
import { OrderActions } from "@/pages/dashboard/orders/components/OrderActions"

export const OrdersList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = useMemo(
    () => searchParams.get("status") as IOrderStatusType,
    [searchParams],
  )

  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<Partial<IOrderFilters>>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    status: initialStatus ?? (ORDER_STATUS.ONGOING as IOrderStatusType),
  })

  const { data: orders, isLoading } = useQuery({
    queryKey: [KEY.DASHBOARD.ORDERS, filters],
    queryFn: () => getOrders(filters),
  })

  const navigate = useNavigate()

  const columns: DataTableColumn<IOrder>[] = [
    {
      accessor: "id",
      title: "Order #",
      width: 200,
      render: ({ id }) => (
        <div className="flex items-center gap-1">
          <p>{id}</p>
          <CopyButton value={id} timeout={500}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
      ),
    },
    {
      accessor: "student.user",
      title: "Student",
      render: ({ student }) => (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-0.5">
            <p className="shrink-0">
              {student.user.fullName} <span className="text-neutral-500">({student.id})</span>
            </p>

            <CopyButton value={student.id.toString()} timeout={500}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy Student ID"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </div>

          <p className="shrink-0 text-neutral-500">{student.user.username}@fairview.sti.edu.ph</p>
        </div>
      ),
    },
    {
      accessor: "total",
      title: "Total",
      width: 130,
      render: (sale) => (
        <div className="flex items-center gap-1">
          <p className="shrink-0">{`₱ ${sale.total.toFixed(2)}`}</p>

          <CopyButton value={sale.total.toString()} timeout={500}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </div>
      ),
    },
    {
      accessor: "status",
      title: "Status",
      render: ({ status }) => (
        <Badge color={orderStatusColor[status]}>{orderStatusLabel[status]}</Badge>
      ),
    },
    {
      accessor: "createdAt",
      title: "Date",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: (order) => (
        <div className="flex justify-center gap-4">
          <ActionIcon
            size="lg"
            variant="light"
            onClick={() => navigate(ROUTES.DASHBOARD.ORDERS.ID.replace(":orderId", order.id))}
          >
            <IconNotes size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]

  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>([])

  useEffect(() => {
    setSelectedOrders([])
  }, [filters.status])

  const showCheckbox = useMemo(() => {
    const allowedStatus = [ORDER_STATUS.ONGOING, ORDER_STATUS.CONFIRMED]

    return filters.status && allowedStatus.includes(filters.status)
  }, [filters.status])

  return (
    <>
      <Card>
        <Card.Section px={24} pt={24}>
          <h1 className="text-xl font-bold">Orders Per Month</h1>
        </Card.Section>

        <Space h={20} />

        <AnnualChart
          queryKey="annual-orders"
          queryFn={getAnnualOrders}
          label="Orders"
          dataKey="orders"
        />
      </Card>

      <Space h={16} />

      <Card>
        <Card.Section px={24} pt={24}>
          <div className="flex h-[36px] items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Manage Orders</h1>

            {selectedOrders.length > 0 && (
              <OrderActions
                status={filters?.status as IOrderStatusType}
                selectedOrders={selectedOrders}
                onSuccess={() => setSelectedOrders([])}
              />
            )}
          </div>

          <OrdersFilter filters={filters} onFilter={setFilterValues} />
        </Card.Section>

        <Space h={16} />

        <Card.Section px={24} pb={24}>
          <DataTable
            columns={columns}
            records={orders?.data ?? []}
            // State
            fetching={isLoading}
            noRecordsIcon={
              <Box p={4} mb={4}>
                <IconMoodSad size={36} strokeWidth={1.5} />
              </Box>
            }
            noRecordsText="No Orders found"
            // Styling
            verticalSpacing="md"
            highlightOnHover
            withTableBorder
            striped
            borderRadius={6}
            minHeight={340}
            // Pagination
            totalRecords={orders?.meta.totalItems ?? 0}
            recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
            page={filters.page ?? DEFAULT_PAGE}
            onPageChange={(p) => setFilters("page", p)}
            selectedRecords={showCheckbox ? selectedOrders : undefined}
            onSelectedRecordsChange={showCheckbox ? setSelectedOrders : undefined}
          />
        </Card.Section>
      </Card>
    </>
  )
}
