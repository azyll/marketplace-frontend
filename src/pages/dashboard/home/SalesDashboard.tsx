import { getAnnualSales } from "@/services/sales.service"
import { Card, Flex, Grid, Space, Text } from "@mantine/core"
import { SalesTrendCard } from "../sales/list/SalesTrendCard"
import { AnnualSalesCard } from "../sales/list/AnnualSalesCard"
import AnnualChart from "../components/AnnualChart"
import { DepartmentSalesChart } from "../sales/list/DepartmentSalesChart"
import { LogsCard } from "../components/LogsCard"
export default function SalesDashboard() {
  return (
    <>
      <Text fw={"bold"} my={"sm"}>
        Sales Module
      </Text>

      <Grid grow gutter="lg" align="stretch">
        {/* Monthly & Annual Sales Trend */}
        <Grid.Col span={5}>
          <SalesTrendCard />
          <Space h="lg" />
          <AnnualSalesCard />
        </Grid.Col>

        {/* Line Chart (Sales per month)*/}
        <Grid.Col span={7}>
          <Card>
            <Card.Section px={24} pt={24}>
              <h1 className="text-sm font-semibold">Sales Per Month</h1>
            </Card.Section>

            <AnnualChart
              queryKey="annual-sales"
              queryFn={getAnnualSales}
              label="Sales"
              dataKey="sales"
            />
          </Card>
        </Grid.Col>

        {/* Bar Chart (Sales per department) */}
        <Grid.Col span={7}>
          <Card>
            <Card.Section px={24} pt={24} pb={12}>
              <h1 className="text-sm font-semibold">Sales By Department</h1>
            </Card.Section>

            <DepartmentSalesChart />
          </Card>
        </Grid.Col>

        {/* Activity Logs */}
        <Grid.Col span={5}>
          <Card>
            <Card.Section px={24} pt={24} pb={12}>
              <h1 className="text-sm font-semibold">Sales Activity</h1>
            </Card.Section>

            <LogsCard type="sales" />
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}
