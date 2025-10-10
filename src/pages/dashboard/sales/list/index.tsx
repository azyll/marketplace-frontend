import { KEY } from "@/constants/key"
import { ROUTES } from "@/constants/routes"
import { useFilters } from "@/hooks/useFilters"
import { getSales } from "@/services/sales.service"
import { ISales } from "@/types/sale.type"
import { ActionIcon, Badge, Box, Card, CopyButton, Space, Tooltip } from "@mantine/core"
import { IconCheck, IconCopy, IconMoodSad, IconNotes } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useNavigate } from "react-router"

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
      width: 100,
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
      accessor: "student.user",
      title: "Student",
      width: 250,
      render: (sale) => (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-0.5">
            <p className="shrink-0">
              {sale.order.student.user.fullName}{" "}
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
      width: 100,
      render: (sale) => (
        <Badge variant="light">{sale.order.student.program.acronym.toUpperCase()}</Badge>
      ),
    },
    {
      accessor: "total",
      title: "Total",
      width: 130,
      render: (sale) => `₱ ${sale.total.toFixed(2)}`,
    },
    {
      accessor: "actions",
      title: "Actions",
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
      <Card>
        <Card.Section px={24} pt={24}>
          <div className="flex h-[36px] items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Manage Sales</h1>
          </div>
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
