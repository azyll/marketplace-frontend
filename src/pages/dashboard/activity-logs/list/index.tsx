import { KEY } from "@/constants/key"
import { useFilters } from "@/hooks/useFilters"
import { getActivityLogs } from "@/services/activity-log.service"
import { IActivityLog, IGetActivityLogFilters } from "@/types/activity-log"
import { Box, Card, Space } from "@mantine/core"
import { IconMoodSad } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { ActivityLogFilter } from "./ActivityLogFilter"

export function ActivityLogList() {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IGetActivityLogFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: [KEY.ACTIVITY_LOGS, filters],
    queryFn: async () => await getActivityLogs(filters),
  })

  const columns: DataTableColumn<IActivityLog>[] = [
    {
      accessor: "title",
      title: "Title",
    },

    {
      accessor: "content",
      title: "Content",
    },
    {
      accessor: "type",
      title: "Type",
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "-"),
    },
  ]
  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">View Activity Logs</h1>
        </div>
        <ActivityLogFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>
      <Space h={16} />
      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={activityLogs?.data ?? []}
          // State
          fetching={isLoading}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No return item found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={activityLogs?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
