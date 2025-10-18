import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { getAnnualSales, getSales } from "@/services/sales.service"
import { ISales } from "@/types/sales.type"
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  CopyButton,
  Flex,
  Group,
  NumberFormatter,
  Space,
  Stack,
  Tooltip,
} from "@mantine/core"
import { IconCheck, IconCopy, IconMoodSad, IconNotes } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"
import AnnualChart from "../../components/AnnualChart"
import { LogsCard } from "../../components/LogsCard"
import { SalesTrendCard } from "./SalesTrendCard"
import { DepartmentSalesChart } from "./DepartmentSalesChart"
import { AnnualSalesCard } from "./AnnualSalesCard"
import { SalesFilter } from "./SalesFilter"
import dayjs from "dayjs"
import { SalesReportDownloader } from "./SalesReport"

export const SalesList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: sales, isLoading } = useQuery({
    queryKey: [KEY.DASHBOARD.SALES, filters],
    queryFn: () => getSales(filters),
  })

  const navigate = useNavigate()

  const columns: DataTableColumn<ISales>[] = [
    // {
    //   accessor: "id",
    //   title: "Sales #",
    //   width: 200,
    // },
    {
      accessor: "oracleInvoice",
      title: "Sales Invoice #",
      render: (sale) => (
        <div className="flex items-center gap-1">
          <p className="shrink-0">{sale.oracleInvoice}</p>

          <CopyButton value={sale.oracleInvoice} timeout={500}>
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
      accessor: "orderId",
      title: "Order #",
    },
    {
      accessor: "student.user",
      title: "Student",
      render: (sale) => (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-0.5">
            <p className="shrink-0">
              {sale.order.student.user.fullName}
              <span className="text-neutral-500">({sale.order.student.id})</span>
            </p>
          </div>

          <p className="shrink-0 text-neutral-500">
            {sale.order.student.user.username}@fairview.sti.edu.ph
          </p>
        </div>
      ),
    },
    {
      accessor: "order.student.program.acronym",
      title: "Program",
      render: (sale) => (
        <Badge variant="light">{sale.order.student.program.acronym.toUpperCase()}</Badge>
      ),
    },
    {
      accessor: "total",
      title: "Total",
      render: (sale) => (
        <NumberFormatter
          prefix="₱ "
          value={sale.total}
          thousandSeparator
          decimalSeparator="."
          decimalScale={2}
          fixedDecimalScale
        />
      ),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      accessor: "View",
      title: "View",
      width: 120,
      textAlign: "center",
      render: (sale) => (
        <div className="flex justify-center gap-4">
          <ActionIcon
            size="lg"
            variant="light"
            onClick={() =>
              navigate(ROUTES.DASHBOARD.SALES.ID.replace(":salesId", sale.oracleInvoice))
            }
          >
            <IconNotes size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]
  return (
    <>
      <Flex align="flex-start" justify="flex-start" wrap="wrap" gap="lg">
        {/* Monthly & Annual Sales Trend */}
        <Stack style={{ flex: "1 1 calc(30% - 0.75rem)" }}>
          <SalesTrendCard />
          <AnnualSalesCard />
        </Stack>

        {/* Line Chart (Sales per month)*/}
        <Card style={{ flex: "1 1 calc(50% - 0.75rem)" }}>
          <Card.Section px={24} pt={24}>
            <h1 className="text-sm font-semibold">Sales Per Month</h1>
          </Card.Section>

          <Space h={16} />

          <AnnualChart
            queryKey="annual-sales"
            queryFn={getAnnualSales}
            label="Sales"
            dataKey="sales"
          />
        </Card>
      </Flex>

      <Space h={16} />

      <Flex align="flex-start" justify="flex-start" wrap="wrap" gap="lg">
        {/* Bar Chart (Sales per department) */}
        <Card style={{ flex: "1 1 calc(50% - 0.75rem)" }}>
          <Card.Section px={24} pt={24} pb={12}>
            <h1 className="text-sm font-semibold">Sales By Department</h1>
          </Card.Section>

          <DepartmentSalesChart />
        </Card>

        {/* Activity Logs */}
        <Card style={{ flex: "1 1 calc(40% - 0.75rem)" }}>
          <Card.Section px={24} pt={24} pb={12}>
            <h1 className="text-sm font-semibold">Sales Activity</h1>
          </Card.Section>

          <LogsCard type="sales" />
        </Card>
      </Flex>

      <Space h={16} />

      {/* Table */}
      <Card>
        <Card.Section px={24} pt={24}>
          <div className="flex h-[36px] items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Manage Sales</h1>
            <SalesReportDownloader />
          </div>

          <SalesFilter filters={filters} onFilter={setFilterValues} />
        </Card.Section>

        <Space h={16} />

        <Card.Section px={24} pb={24}>
          <DataTable
            columns={columns}
            records={sales?.data}
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
            totalRecords={sales?.meta.totalItems ?? 0}
            recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
            page={filters.page ?? DEFAULT_PAGE}
            onPageChange={(p) => setFilters("page", p)}
          ></DataTable>
        </Card.Section>
      </Card>
    </>
  )
}
