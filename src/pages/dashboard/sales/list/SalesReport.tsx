import { Button, Menu } from "@mantine/core"
import { IconDownload, IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { getSalesReport } from "@/services/report.service"
import { IPaginatedSalesResponse } from "@/types/sales.type"

type SalesResponse = IPaginatedSalesResponse

interface SalesReportRow {
  issuanceCode: string
  orderDate: string
  studentNumber: string
  studentName: string
  product: string
  quantity: number
  srp: number
  total: number
  status: string
  invoiceNumber: string
  issuanceDate: string
}

const HEADERS = [
  "Issuance Code",
  "ORDER DATE",
  "STUDENT NUMBER",
  "ISSUED TO",
  "ITEM DESCRIPTION",
  "QTY",
  "SRP",
  "TOTAL",
  "STATUS",
  "INVOICE NO",
  "ISSUANCE DATE",
]

const transformSalesData = (data: SalesResponse): SalesReportRow[] =>
  data.data.flatMap((sale) => {
    const order = sale.order
    if (!order?.orderItems?.length) return []

    return order.orderItems.map((item) => ({
      issuanceCode: sale.id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      studentNumber: order.studentId?.toString() ?? "",
      studentName: order.student.user.fullName,
      product: item.productVariant?.product?.name || item.productVariant?.name || "N/A",
      quantity: item.quantity,
      srp: item.productVariant?.price || 0,
      total: item.quantity * (item.productVariant?.price || 0),
      status: "ISSUED",
      invoiceNumber: sale.oracleInvoice || "N/A",
      issuanceDate: new Date(sale.createdAt).toLocaleDateString(),
    }))
  })

const useSalesReport = () =>
  useQuery({
    queryKey: ["sales-report"],
    queryFn: getSalesReport,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

const createExcelFile = (rows: SalesReportRow[]) => {
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.sheet_add_aoa(ws, [HEADERS], { origin: "A1" })
  ws["!cols"] = HEADERS.map(() => ({ wch: 15 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Sales Report")
  XLSX.writeFile(wb, `sales-report-${new Date().toISOString().split("T")[0]}.xlsx`)
}

const createPDFFile = (rows: SalesReportRow[], meta: any) => {
  const doc = new jsPDF("landscape")

  doc.setFont("helvetica", "normal")

  doc.setFontSize(16).text("Sales Report", 14, 15)
  doc.setFontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 14, 22)

  autoTable(doc, {
    startY: 28,
    head: [HEADERS],
    body: rows.map((r) => [
      r.issuanceCode,
      r.orderDate,
      r.studentNumber,
      r.studentName,
      r.product,
      r.quantity,
      `PHP ${r.srp.toFixed(2)}`,
      `PHP ${r.total.toFixed(2)}`,
      r.status.toUpperCase(),
      r.invoiceNumber,
      r.issuanceDate,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: "bold" },
  })

  const y = (doc as any).lastAutoTable.finalY + 10
  doc.text(`Total Sales: PHP ${meta?.totalSales?.toFixed(2) ?? 0}`, 14, y)
  doc.text(`Total Items: ${meta?.totalItems ?? 0}`, 14, y + 6)

  doc.save(`sales-report-${new Date().toISOString().split("T")[0]}.pdf`)
}

export const SalesReportDownloader = () => {
  const { data, isLoading, isError, refetch } = useSalesReport()

  const downloadReport = async (type: "excel" | "pdf") => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "Failed to load sales data. Click to retry.",
        color: "red",
        onClick: () => refetch(),
      })
      return
    }

    if (!data) {
      notifications.show({ title: "Error", message: "No data available", color: "red" })
      return
    }

    try {
      const rows = transformSalesData(data)
      type === "excel" ? createExcelFile(rows) : createPDFFile(rows, data.meta)
      notifications.show({
        title: "Success",
        message: `${type.toUpperCase()} file downloaded successfully`,
        color: "green",
      })
    } catch (err) {
      console.error(err)
      notifications.show({
        title: "Error",
        message: `Failed to download ${type.toUpperCase()} file`,
        color: "red",
      })
    }
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button leftSection={<IconDownload size={16} />} loading={isLoading} disabled={isError}>
          Download Report
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Export Format</Menu.Label>
        <Menu.Item
          leftSection={<IconFileTypeXls size={16} />}
          onClick={() => downloadReport("excel")}
          disabled={!data}
        >
          Excel (.xlsx)
        </Menu.Item>
        <Menu.Item
          leftSection={<IconFileTypePdf size={16} />}
          onClick={() => downloadReport("pdf")}
          disabled={!data}
        >
          PDF (.pdf)
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
